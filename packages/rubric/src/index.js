import {
  ModelUpdatedEvent,

} from '@pie-framework/pie-configure-events';

// import React from 'react';
// import ReactDOM from 'react-dom';
import debug from 'debug';


export default class RubricRender extends HTMLElement {

  constructor() {
    super();
    debug.log('constructor called');
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = s;
    this._render();
  }

  onModelChanged(m) {
    this._model = m;
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `hello world`;
  }
}
