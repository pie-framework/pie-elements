import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './main';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

import defaults from './defaults';

export default class Calculator extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaults,
    ...model,
  });

  constructor() {
    super();
    this._root = null;
    this._model = Calculator.createDefaultModel();
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = Calculator.createDefaultModel(s);
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
        onChange: this.onModelChanged,
      });
      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(element);
    }
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
