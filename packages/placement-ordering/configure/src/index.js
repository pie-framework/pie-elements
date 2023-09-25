import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
} from '@pie-framework/pie-configure-events';

import Main from './design';
import React from 'react';
import ReactDOM from 'react-dom';
import defaultValues from './defaults';
import defaults from 'lodash/defaults';

const prepareCustomizationObject = (config, model) => {
  const configuration = defaults(config, defaultValues.configuration);

  return { configuration, model };
};

export const addWeightToCorrectResponse = (correctResponse) =>
  correctResponse &&
  correctResponse.map((correct) => {
    // if weight is set
    if (correct.weight !== undefined) {
      return { id: correct.id, weight: correct.weight };
    } else {
      return { id: correct, weight: 0 };
    }
  });
/**
 * assuming that the correct response will be set via ui, not via config,
 * correctResponse (if not set) will be initialized with choices default order
 */
export default class PlacementOrdering extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    const mapChoicesToReturnCorrectResponse = (choices) => choices && choices.map((ch) => ({ id: ch.id, weight: 0 }));

    let correctResponse =
      addWeightToCorrectResponse(model.correctResponse) || mapChoicesToReturnCorrectResponse(model.choices);

    const defaultModel = {
      ...defaultValues.model,
      ...model,
    };

    if (correctResponse) {
      defaultModel.correctResponse = correctResponse;
    }

    return defaultModel;
  };

  constructor() {
    super();

    this._model = PlacementOrdering.createDefaultModel();
    this._configuration = defaultValues.configuration;

    this.onModelChanged = (model, resetSession) => {
      this._model = model;
      this._rerender();
      this.dispatchUpdate(resetSession);
    };

    this.onConfigurationChanged = (configuration) => {
      this._configuration = prepareCustomizationObject(configuration).configuration;

      this.onModelChanged(this._model);
      this._rerender();
    };

    this.insertImage = (handler) => {
      this.dispatchEvent(new InsertImageEvent(handler));
    };

    this.deleteImage = (src, done) => {
      this.dispatchEvent(new DeleteImageEvent(src, done));
    };
  }

  dispatchUpdate(reset) {
    this.dispatchEvent(new ModelUpdatedEvent(this._model, reset));
  }

  set model(s) {
    this._model = PlacementOrdering.createDefaultModel(s);
    this._rerender();
  }

  set configuration(c) {
    const info = prepareCustomizationObject(c, this._model);

    this.onModelChanged(info.model);

    const newConfiguration = {
      ...defaultValues.configuration,
      ...info.configuration,
    };

    this._configuration = newConfiguration;

    // if language:enabled is true, then the corresponding default item model should include a language value;
    // if it is false, then the language field should be omitted from the item model.
    // if a default item model includes a language value (e.g., en_US) and the corresponding authoring view settings have language:settings = true,
    // then (a) language:enabled should also be true, and (b) that default language value should be represented in languageChoices[] (as a key).
    if (newConfiguration?.language?.enabled) {
      if (newConfiguration?.languageChoices?.options?.length) {
        this._model.language = newConfiguration?.languageChoices.options[0].value;
      }
    } else if (newConfiguration.language.settings && this._model.language) {
      this._configuration.language.enabled = true;

      if (!this._configuration.languageChoices.options || !this._configuration.languageChoices.options.length) {
        this._configuration.languageChoices.options = [];
      }

      // check if the language is already included in the languageChoices.options array
      // and if not, then add it.
      if (!this._configuration.languageChoices.options.find(option => option.value === this._model.language)) {
        this._configuration.languageChoices.options.push({
          value: this._model.language,
          label: this._model.language,
        });
      }
    } else {
      delete this._model.language;
    }

    this._rerender();
  }

  insertSound(handler) {
    this.dispatchEvent(new InsertSoundEvent(handler));
  }

  onDeleteSound(src, done) {
    this.dispatchEvent(new DeleteSoundEvent(src, done));
  }

  _rerender() {
    let element = React.createElement(Main, {
      model: this._model,
      configuration: this._configuration,
      onModelChanged: this.onModelChanged,
      onConfigurationChanged: this.onConfigurationChanged,
      imageSupport: {
        add: this.insertImage,
        delete: this.deleteImage,
      },
      uploadSoundSupport: {
        add: this.insertSound.bind(this),
        delete: this.onDeleteSound.bind(this),
      },
    });

    ReactDOM.render(element, this);
  }
}
