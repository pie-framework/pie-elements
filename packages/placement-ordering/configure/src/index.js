import {
  DeleteImageEvent,
  InsertImageEvent,
  ModelUpdatedEvent
} from '@pie-framework/pie-configure-events';

import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import defaultValues from './defaultConfiguration';
import defaults from 'lodash/defaults';

/**
 * assuming that the correct response will be set via ui, not via config,
 * correctResponse (if not set) will be initialized with choices default order
 */
export default class PlacementOrdering extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    return {
      ...defaultValues,
      ...model,
      configure: defaults(model.configure, defaultValues.configure),
      correctResponse: model.correctResponse || (model.choices && model.choices.map(ch => ({ id: ch.id, weight: 0 }))) || defaultValues.correctResponse
    };
  };

  constructor() {
    super();
    this._model = PlacementOrdering.createDefaultModel();
    this.onModelChanged = (model, resetSession) => {
      this._model = model;
      this.dispatchUpdate(resetSession);
    };

    this.insertImage = handler => {
      this.dispatchEvent(new InsertImageEvent(handler));
    };

    this.deleteImage = (src, done) => {
      this.dispatchEvent(new DeleteImageEvent(src, done));
    };
  }

  dispatchUpdate(reset) {
    const detail = { update: this._model, reset };
    this.dispatchEvent(new ModelUpdatedEvent(this._model, reset));
  }

  set model(s) {
    this._model = PlacementOrdering.createDefaultModel(s);
    this._rerender();
  }

  _rerender() {
    let element = React.createElement(Main, {
      model: this._model,
      onModelChanged: this.onModelChanged,
      imageSupport: {
        add: this.insertImage,
        delete: this.deleteImage
      }
    });
    ReactDOM.render(element, this);
  }
}
