import React from 'react';
import ReactDOM from 'react-dom';
import Component from './main';

export default class CategorizeConfigure extends HTMLElement {
  set model(m) {
    this._model = m;
    this.render();
  }
  connectedCallback() {}

  render() {
    const el = React.createElement(Component, {});
    ReactDOM.render(el, this);
  }
}
