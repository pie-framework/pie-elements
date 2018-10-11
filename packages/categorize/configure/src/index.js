import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent
} from '@pie-framework/pie-configure-events';

export default class CategorizeConfigure extends HTMLElement {
  set model(m) {
    this._model = m;
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
