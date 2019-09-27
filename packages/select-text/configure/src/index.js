import React from 'react';
import ReactDOM from 'react-dom';
import Main from './design';
import {
  DeleteImageEvent,
  InsertImageEvent,
  ModelUpdatedEvent
} from '@pie-framework/pie-configure-events';
import defaultValues from './defaultConfiguration';

export default class SelectTextConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    return {
      ...defaultValues.model,
      ...model
    };
  };

  constructor() {
    super();
    this._model = SelectTextConfigure.createDefaultModel();
    this._configuration = defaultValues.configuration;
  }

  set model(m) {
    this._model = SelectTextConfigure.createDefaultModel(m);
    this.render();
  }

  set configuration(c) {
    this._configuration = c;
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

  onConfigurationChanged(c) {
    this._configuration = c;

    if (this._model) {
      this.dispatchEvent(new ModelUpdatedEvent(this._model), false);
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

  render() {
    if (this._model) {
      const el = React.createElement(Main, {
        model: this._model,
        configuration: this._configuration,
        onModelChanged: this.modelChanged.bind(this),
        onConfigurationChanged: this.onConfigurationChanged.bind(this),
        imageSupport: {
          add: this.insertImage.bind(this),
          delete: this.onDeleteImage.bind(this)
        }
      });

      ReactDOM.render(el, this);
    }
  }
}
