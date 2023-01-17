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

  constructor() {
    super();
    this._model = CategorizeConfigure.createDefaultModel();
    this._configuration = defaults.configuration;
  }

  set model(m) {
    this._model = CategorizeConfigure.createDefaultModel(m);
    this.render();
  }

  set configuration(c) {
    this._configuration = c;
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
