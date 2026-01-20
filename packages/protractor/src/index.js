import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './main';

export default class Protractor extends HTMLElement {
  constructor() {
    super();
    this._root = null;
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
    if (!this._root) {
      this._root = createRoot(this);
    }
    this._root.render(el);
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
