import React from 'react';
import ReactDOM from 'react-dom';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
} from '@pie-framework/pie-configure-events';

import Main from './main';

import defaults from './defaults';

export default class CategorizeConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaults.model,
    ...model,
  });

  // PD-2960: make sure we don't have alternates in model or possibility to add them (temporary solution)
  // this function is used in controller, too
  static disableAlternateResponses = (m) => {
    let { correctResponse } = m || {};
    correctResponse = correctResponse || [];
    const mappedCorrectResponse = correctResponse.map((cr) => {
      const { alternateResponses, ...response } = cr;
      return response;
    });
    return {
      ...m,
      correctResponse: mappedCorrectResponse,
      allowAlternateEnabled: false,
    };
  };

  constructor() {
    super();
    this._model = CategorizeConfigure.createDefaultModel();
    this._configuration = defaults.configuration;
  }

  set model(m) {
    this._model = CategorizeConfigure.disableAlternateResponses(CategorizeConfigure.createDefaultModel(m));
    this.render();
  }

  set configuration(c) {
    this._configuration = c;

    // if language:enabled is true, then the corresponding default item model should include a language value;
    // if it is false, then the language field should be omitted from the item model.
    // if a default item model includes a language value (e.g., en_US) and the corresponding authoring view settings have language:settings = true,
    // then (a) language:enabled should also be true, and (b) that default language value should be represented in languageChoices[] (as a key).
    if (c.language.enabled) {
      if (c.languageChoices?.options?.length) {
        this._model.language = c.languageChoices.options[0].value;
      }
    } else if (c.language.settings && this._model.language) {
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

    this.render();
  }

  onModelChanged(m) {
    this._model = m;

    this.render();
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  onConfigurationChanged(c) {
    this._configuration = c;
    this.render();
  }

  connectedCallback() {}

  /**
   *
   * @param {done, progress, file} handler
   */
  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  insertSound(handler) {
    this.dispatchEvent(new InsertSoundEvent(handler));
  }

  onDeleteSound(src, done) {
    this.dispatchEvent(new DeleteSoundEvent(src, done));
  }

  render() {
    const el = React.createElement(Main, {
      model: this._model,
      configuration: this._configuration,
      onModelChanged: this.onModelChanged.bind(this),
      onConfigurationChanged: this.onConfigurationChanged.bind(this),
      imageSupport: {
        add: this.insertImage.bind(this),
        delete: this.onDeleteImage.bind(this),
      },
      uploadSoundSupport: {
        add: this.insertSound.bind(this),
        delete: this.onDeleteSound.bind(this),
      },
    });

    ReactDOM.render(el, this);
  }
}
