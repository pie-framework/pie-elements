import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent
} from '@pie-framework/pie-configure-events';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';

import defaults from './defaults';

export default class ExtendedTextEntry extends HTMLElement {
  static createDefaultModel = (model = {}, config) => {
    const defaultModel = {
      ...defaults.model,
      ...model,
    };

    if (config?.withRubric?.forceEnabled && !defaultModel.rubricEnabled) {
      defaultModel.rubricEnabled = true;
    }

    return defaultModel;
  };

  constructor() {
    super();
    this._configuration = defaults.configuration;
    this._model = ExtendedTextEntry.createDefaultModel({}, this._configuration);
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  verifyRubric = async (c) => {
    const { withRubric = {} } = c || {};

    if (withRubric?.forceEnabled && !this._model.rubricEnabled) {
      this._model.rubricEnabled = true;
      this.dispatchEvent(new ModelUpdatedEvent(this._model));
    }
  }

  set model(m) {
    this._model = ExtendedTextEntry.createDefaultModel(m, this._configuration);
    this.render();
  }

  set configuration(c) {
    this._configuration = {
      ...defaults.configuration,
      ...c
    };

    this.verifyRubric(this._configuration);

    this.render();
  }

  onModelChanged(m) {
    this._model = m;
    this.render();
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  onConfigurationChanged(c) {
    this._configuration = {
      ...defaults.configuration,
      ...c
    };

    if (this._model) {
      const { withRubric = {} } = c || {};

      if (withRubric?.forceEnabled) {
        this._model.rubricEnabled = true;
      }

      this.onModelChanged(this._model);
    }

    this.render();
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

  render() {
    console.log('this._model.rubricEnabled', this._model.rubricEnabled);

    if (this._model) {
      const element = React.createElement(Main, {
        model: this._model,
        configuration: this._configuration,
        onModelChanged: this.onModelChanged.bind(this),
        onConfigurationChanged: this.onConfigurationChanged.bind(this),
        imageSupport: {
          add: this.insertImage.bind(this),
          delete: this.onDeleteImage.bind(this)
        },
        uploadSoundSupport: {
          add: this.insertSound.bind(this),
          delete: this.onDeleteSound.bind(this)
        }
      });
      ReactDOM.render(element, this);
    }
  }
}
