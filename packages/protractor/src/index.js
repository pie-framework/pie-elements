import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';

export default class Protractor extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  set model(m) {
    this._model = m;
    this.render();
  }

  render() {
    const el = React.createElement(Main, {});
    ReactDOM.render(el, this);
  }
}
