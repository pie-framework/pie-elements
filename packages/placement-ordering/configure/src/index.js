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
    this._configuration = info.configuration;
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
