import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

// foo test

export default class extends HTMLElement {
  constructor() {
    super();
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
    if (this._model) {
      const element = React.createElement(Main, {
        model: this._model,
        onChange: this.onModelChanged
      });
      ReactDOM.render(element, this);
    }
  }
}
