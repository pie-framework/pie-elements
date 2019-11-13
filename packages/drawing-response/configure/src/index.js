import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
} from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

import Root from './root';
import sensibleDefaults from './defaults';

const log = debug('hotspot:configure');

export default class DrawableResponseConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...sensibleDefaults.model,
    ...model,
  });

  constructor() {
    super();
    this._model = DrawableResponseConfigure.createDefaultModel();
    this._configuration = sensibleDefaults.configuration;
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = DrawableResponseConfigure.createDefaultModel(s);
    this._render();
  }

  set configuration(c) {
    this._configuration = c;
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
    if (!c.backgroundImage.enabled) {
      this.onImageUpload('');
    }
    this._configuration = c;
    this._render();
  };

  insertImage = (handler) => {
    this.dispatchEvent(new InsertImageEvent(handler));
  };

  onDeleteImage = (src, done) => {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  };

  _render() {
    log('_render');
    let element = React.createElement(Root, {
      model: this._model,
      configuration: this._configuration,
      onModelChanged: this.onModelChanged,
      onConfigurationChanged: this.onConfigurationChanged,
      imageSupport: {
        add: this.insertImage,
        delete: this.onDeleteImage
      }
    });
    ReactDOM.render(element, this);
  }
}
