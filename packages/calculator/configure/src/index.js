import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

export default class Calculator extends HTMLElement {
  static prepareModelObject = (model = {}) => {
    const { mode } = model;

    return {
      mode: mode || 'basic',
      ...model,
    };
  };

  constructor() {
    super();
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = Calculator.prepareModelObject(s);
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
