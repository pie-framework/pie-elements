import { DeleteImageEvent, InsertImageEvent, ModelUpdatedEvent } from '@pie-libs/pie-configure-events';

import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

const log = debug('pie-elements:placement-ordering');

export default class PlacementOrdering extends HTMLElement {

  constructor() {
    super();
    this.onModelChange = (model, resetSession) => {
      this._model = model;
      this.dispatchUpdate(resetSession);
    }

    this.insertImage = (handler) => {
      this.dispatchEvent(new InsertImageEvent(handler));
    }

    this.deleteImage = (src, done) => {
      this.dispatchEvent(new DeleteImageEvent(src, done));
    }
  }

  dispatchUpdate(reset) {
    const detail = { update: this._model, reset }
    this.dispatchEvent(new ModelUpdatedEvent(this._model, reset));
  }

  set model(s) {
    this._model = s;
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