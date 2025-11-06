import Rubric from './main';
import React from 'react';
import { createRoot } from 'react-dom/client';
import debug from 'debug';
import { renderMath } from '@pie-lib/math-rendering';

export default class RubricRender extends HTMLElement {
  constructor() {
    super();
    debug.log('constructor called');
    this.onModelChanged = this.onModelChanged.bind(this);
    this._root = null;
  }

  set model(s) {
    this._model = s;
    this._render();
  }

  onModelChanged(m) {
    this._model = m;
    this._render();
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (this._model) {
      const el = <Rubric value={this._model} />;

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(el);
      queueMicrotask(() => {
        renderMath(this);
      });
    }
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
