import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import isEmpty from 'lodash/isEmpty';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent
} from '@pie-framework/pie-configure-events';
import debug from 'debug';

import defaults from './defaults';

const log = debug('pie-elements:math-inline:configure');

export default class MathInlineConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => {

    // making sure that validation type is set
    if (!isEmpty(model.responses)) {
      model.responses = model.responses.map(correctResponse => ({
        ...correctResponse,
        validation: correctResponse.validation || defaults.model.validationDefault,
        allowTrailingZeros: correctResponse.allowTrailingZeros || defaults.model.allowTrailingZerosDefault,
        ignoreOrder: correctResponse.ignoreOrder || defaults.model.ignoreOrderDefault || false
      }))
    }

    return { ...defaults.model, ...model }
  };

  constructor() {
    super();
    this._model = MathInlineConfigure.createDefaultModel();
    this._configuration = defaults.configuration;
  }

  set model(m) {
    this._model = MathInlineConfigure.createDefaultModel(m);
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

  onConfigurationChanged(c) {
    this._configuration = c;

    if (this._model) {
      this.onModelChanged(this._model);
    }

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
        }
      });

      ReactDOM.render(el, this);
    }
  }
}
