import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

export default class CategorizeConfigure extends HTMLElement {
  set model(m) {
    this._model = m;
    this.render();
  }

  onChange(m) {
    this._model = m;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));
  }

  connectedCallback() {}

  render() {
    const el = React.createElement(Main, {
      model: this._model,
      onChange: this.onChange.bind(this)
    });
    ReactDOM.render(el, this);
  }
}
