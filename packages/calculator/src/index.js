import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import { CalculatorLayout } from './draggable-calculator';

export { CalculatorLayout };

export default class Calculator extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;

    this._rerender = () => {
      if (this._model) {
        let elem = React.createElement(Main, {
          model: this._model
        });
        ReactDOM.render(elem, this);
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
}
