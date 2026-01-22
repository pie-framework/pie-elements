import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './main';
import { CalculatorLayout } from './draggable-calculator';

export { CalculatorLayout };

export default class Calculator extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;
    this._root = null;

    this._rerender = () => {
      if (this._model) {
        let elem = React.createElement(Main, {
          model: this._model,
        });
        if (!this._root) {
          this._root = createRoot(this);
        }
        this._root.render(elem);
      }
    };
  }

  set model(m) {
    this._model = m;
    this._rerender();
  }

  connectedCallback() {
    this._rerender();
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
