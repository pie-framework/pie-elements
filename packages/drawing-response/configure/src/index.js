import {
  DeleteImageEvent,
  DeleteSoundEvent,
  InsertImageEvent,
  InsertSoundEvent,
  ModelUpdatedEvent,
} from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

import Root from './root';
import sensibleDefaults from './defaults';

const log = debug('hotspot:configure');

export default class DrawableResponseConfigure extends HTMLElement {
  static createDefaultModel = (model = {}, config) => {
    const defaultModel = {
      ...sensibleDefaults.model,
      ...model,
    };

    // if configuration.withRubric.forceEnabled is true, then we update the model
    // without triggering the Model Updated event (for more details, check documentation)
    if (config?.withRubric?.forceEnabled && !defaultModel.rubricEnabled) {
      defaultModel.rubricEnabled = true;
    }

    return defaultModel;
  };

  constructor() {
    super();
    this._configuration = sensibleDefaults.configuration;

    // if configuration.withRubric.forceEnabled is true, then we
    // update the configuration (we do not want to display the toggle in the Settings Panel)
    if (this._configuration.withRubric?.forceEnabled) {
      this._configuration.withRubric.settings = false;
    }

    this._model = DrawableResponseConfigure.createDefaultModel({}, this._configuration);
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = DrawableResponseConfigure.createDefaultModel(s, this._configuration);
    this._render();
  }

  set configuration(c) {
    this._configuration = c;

    const { withRubric = {} } = c || {};

    // if configuration.withRubric.forceEnabled is true, then we update the model
    // without triggering the Model Updated event (for more details, check documentation)
    // and also update the configuration (we do not want to display the toggle in the Settings Panel)
    if (withRubric?.forceEnabled) {
      this._configuration.withRubric.settings = false;

      if (!this._model.rubricEnabled) {
        this._model.rubricEnabled = true;
      }
    }


    this._render();
  }

  dispatchModelUpdated(reset) {
    const resetValue = !!reset;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, resetValue));
  }

  onModelChanged = (m, reset) => {
    this._model = m;
    this.dispatchModelUpdated(reset);
    this._render();
  };

  onConfigurationChanged = (c) => {
    this._configuration = c;

    this._render();
  };

  insertImage = (handler) => {
    this.dispatchEvent(new InsertImageEvent(handler));
  };

  onDeleteImage = (src, done) => {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  };

  insertSound(handler) {
    this.dispatchEvent(new InsertSoundEvent(handler));
  }

  onDeleteSound(src, done) {
    this.dispatchEvent(new DeleteSoundEvent(src, done));
  }

  _render() {
    log('_render');

    let element = React.createElement(Root, {
      model: this._model,
      configuration: this._configuration,
      onModelChanged: this.onModelChanged,
      onConfigurationChanged: this.onConfigurationChanged,
      imageSupport: {
        add: this.insertImage,
        delete: this.onDeleteImage,
      },
      uploadSoundSupport: {
        add: this.insertSound.bind(this),
        delete: this.onDeleteSound.bind(this),
      },
    });
    ReactDOM.render(element, this);
  }
}
