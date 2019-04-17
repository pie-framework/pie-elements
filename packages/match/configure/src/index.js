import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent
} from '@pie-framework/pie-configure-events';
import debug from 'debug';
import defaults from 'lodash/defaults';

import defaultValues from './defaults';

const log = debug('pie-elements:match:configure');

export default class MatchConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
      ...defaultValues,
      ...model,
      configure: defaults(model.configure, defaultValues.configure),
    }
  );

  constructor() {
    super();
    this._model = MatchConfigure.createDefaultModel();
  }

  set model(m) {
    this._model = MatchConfigure.createDefaultModel(m);
    this._render();
  }

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));
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
