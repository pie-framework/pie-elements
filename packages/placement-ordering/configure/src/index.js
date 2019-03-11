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

const prepareCustomizationObject = (model) => {
  return {
    ...model,
    configure: defaults(model.configure, defaultValues.configure)
  };
};

export default class PlacementOrdering extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    return {
      ...defaultValues,
      configure: defaults(model.configure, defaultValues.configure),
      ...model
    };
  };

  constructor() {
    super();
    this.onModelChange = (model, resetSession) => {
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
      initialModel: this._model,
      onModelChange: this.onModelChange,
      imageSupport: {
        add: this.insertImage,
        delete: this.deleteImage
      }
    });
    ReactDOM.render(element, this);
  }
}
