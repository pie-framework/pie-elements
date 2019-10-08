import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import { DeleteImageEvent, InsertImageEvent, ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import debug from 'debug';

import defaults from './defaults';

const log = debug('pie-elements:text-entry:configure');

export default class TextEntryConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaults.model,
    ...model,
  });

  constructor() {
    super();
    this._model = TextEntryConfigure.createDefaultModel();
    this._configuration = defaults.configuration;
  }

  set model(m) {
    this._model = TextEntryConfigure.createDefaultModel(m);
    this._render();
  }

  set configuration(c) {
    this._configuration = c;
    this.render();
  }

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model));
  }

  onConfigurationChanged(c) {
    this._configuration = c;
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

  _render() {
    if (this._model) {
      const el = React.createElement(Configure, {
        onModelChanged: this.onModelChanged.bind(this),
        onConfigurationChanged: this.onConfigurationChanged.bind(this),
        model: this._model,
        configuration: this._configuration,
      });
      ReactDOM.render(el, this);
    }
  }
}
