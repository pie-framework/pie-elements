import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import {
  DeleteImageEvent,
  InsertImageEvent,
  ModelUpdatedEvent
} from '@pie-framework/pie-configure-events';
import defaults from 'lodash/defaults';
import defaultValues from './defaultConfiguration';

export default class SelectTextConfigure extends HTMLElement {
  static prepareModelObject = (model = {}) => {
    return {
      ...defaultValues,
      configure: defaults(model.configure, defaultValues.configure),
      ...model,
    };
  };

  constructor() {
    super();
  }

  set model(m) {
    this._model = SelectTextConfigure.prepareModelObject(m);
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  modelChanged(m) {
    this._model = m;
    this.dispatchEvent(new ModelUpdatedEvent(this._model), true);
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

  render() {
    if (this._model) {
      const el = React.createElement(Main, {
        model: this._model,
        onChange: this.modelChanged.bind(this),
        imageSupport: {
          add: this.insertImage.bind(this),
          delete: this.onDeleteImage.bind(this)
        }
      });

      ReactDOM.render(el, this);
    }
  }
}
