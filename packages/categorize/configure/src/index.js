import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent
} from '@pie-framework/pie-configure-events';

import defaults from './defaults';

export default class CategorizeConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaults,
    ...model,
  });

  constructor() {
    super();
    this._model = CategorizeConfigure.createDefaultModel();
  }

  set model(m) {
    this._model = CategorizeConfigure.createDefaultModel(m);
    this.render();
  }

  onChange(m) {
    this._model = m;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));
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

  render() {
    const el = React.createElement(Main, {
      model: this._model,
      onChange: this.onChange.bind(this),
      imageSupport: {
        add: this.insertImage.bind(this),
        delete: this.onDeleteImage.bind(this)
      }
    });
    ReactDOM.render(el, this);
  }
}
