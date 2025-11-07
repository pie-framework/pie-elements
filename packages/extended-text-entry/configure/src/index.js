import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
} from '@pie-framework/pie-configure-events';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './main';

import defaults from './defaults';

export default class ExtendedTextEntry extends HTMLElement {
  static createDefaultModel = (model = {}, config) => {
    const defaultModel = { ...defaults.model, ...model };

    // if configuration.withRubric.forceEnabled is true, then we update the model (rubricEnabled)
    // without triggering the Model Updated event (for more details, check documentation)
    if (config?.withRubric?.forceEnabled && !defaultModel.rubricEnabled) {
      defaultModel.rubricEnabled = true;
    }

    return defaultModel;
  };

  constructor() {
    super();
    this._root = null;
    this._configuration = defaults.configuration;

    // if configuration.withRubric.forceEnabled is true, then we
    // update the configuration (we do not want to display the toggle in the Settings Panel)
    if (this._configuration.withRubric?.forceEnabled) {
      this._configuration.withRubric.settings = false;
    }

    this._model = ExtendedTextEntry.createDefaultModel({}, this._configuration);
  }

  set model(m) {
    this._model = ExtendedTextEntry.createDefaultModel(m, this._configuration);
    this.render();
  }

  set configuration(c) {
    this._configuration = {
      ...defaults.configuration,
      ...c,
    };

    const { withRubric = {} } = c || {};

    // if configuration.withRubric.forceEnabled is true, then we update the model (rubricEnabled)
    // without triggering the Model Updated event (for more details, check documentation)
    // and also update the configuration (we do not want to display the toggle in the Settings Panel)
    if (withRubric?.forceEnabled) {
      this._configuration.withRubric.settings = false;

      if (!this._model.rubricEnabled) {
        this._model.rubricEnabled = true;
      }
    }

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
      ...c,
    };

    if (this._model) {
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
    if (this._model) {
      const element = React.createElement(Main, {
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

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(element);
    }
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
