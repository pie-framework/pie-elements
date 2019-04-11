import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent
} from '@pie-framework/pie-configure-events';
import debug from 'debug';

import defaults from './defaults';

const log = debug('pie-elements:math-inline:configure');

export default class MathInlineConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaults,
    ...model
  });

  constructor() {
    super();
    this._model = MathInlineConfigure.createDefaultModel();
  }

  set model(m) {
    this._model = MathInlineConfigure.createDefaultModel(m);
    this._render();
  }

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model));
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
        model: this._model,
        imageSupport: {
          add: this.insertImage.bind(this),
          delete: this.onDeleteImage.bind(this)
        }
      });

      ReactDOM.render(el, this);
    }
  }
}
