import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent
} from '@pie-framework/pie-configure-events';
import debug from 'debug';
import defaultValues from './defaults';

const log = debug('pie-elements:match:configure');

export default class MatchConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
      ...defaultValues.model,
      ...model
    }
  );

  constructor() {
    super();
    this._model = MatchConfigure.createDefaultModel();
    this._configuration = defaultValues.configuration;
  }

  set model(m) {
    this._model = MatchConfigure.createDefaultModel(m);
    this._render();
  }

  set configuration(c) {
    this._configuration = c;
    this._render();
  }

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this._render();
    this.dispatchEvent(new ModelUpdatedEvent(this._model));
  }

  onConfigurationChanged(config) {
    this._configuration = config;
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
          delete: this.onDeleteImage.bind(this)
        },
        uploadSoundSupport: {
          add: this.insertSound.bind(this),
          delete: this.onDeleteSound.bind(this)
        }
      });
      ReactDOM.render(el, this);
    }
  }
}
