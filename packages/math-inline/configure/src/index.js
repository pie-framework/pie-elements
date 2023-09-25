import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import isEmpty from 'lodash/isEmpty';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
} from '@pie-framework/pie-configure-events';
import debug from 'debug';

import defaults from './defaults';

const log = debug('pie-elements:math-inline:configure');

export default class MathInlineConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    // making sure that defaults are set
    if (!isEmpty(model.responses)) {
      model.responses = model.responses.map((correctResponse) => ({
        ...correctResponse,
        validation: correctResponse.validation || defaults.model.validationDefault,
        allowTrailingZeros: correctResponse.allowTrailingZeros || defaults.model.allowTrailingZerosDefault,
        ignoreOrder: correctResponse.ignoreOrder || defaults.model.ignoreOrderDefault || false,
      }));
    }

    return { ...defaults.model, ...model };
  };

  constructor() {
    super();
    this._model = MathInlineConfigure.createDefaultModel();
    this._configuration = defaults.configuration;
  }

  set model(m) {
    this._model = MathInlineConfigure.createDefaultModel(m);
    this._render();
  }

  set configuration(c) {
    const newConfiguration = {
      ...defaults.configuration,
      ...c,
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

    this._render();
  }

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this._render();

    this.dispatchEvent(new ModelUpdatedEvent(this._model));
  }

  onConfigurationChanged(c) {
    this._configuration = c;

    if (this._model) {
      this.onModelChanged(this._model);
    }

    this._render();
  }

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

  _render() {
    if (this._model) {
      const el = React.createElement(Configure, {
        onModelChanged: this.onModelChanged.bind(this),
        onConfigurationChanged: this.onConfigurationChanged.bind(this),
        model: this._model,
        configuration: this._configuration,
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
}
