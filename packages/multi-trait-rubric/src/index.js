import React from 'react';
import { createRoot } from 'react-dom/client';
import { ModelSetEvent } from '@pie-framework/pie-player-events';
import Main from './main';
import { renderMath } from '@pie-lib/math-rendering';

export default class MultiTraitRubric extends HTMLElement {
  constructor() {
    super();
    this._model = {};
    this._session = null;
    this._root = null;
    this._mathObserver = null;
    this._mathRenderPending = false;
  }

  // React commits asynchronously, so a queueMicrotask(renderMath) can run before
  // the LaTeX spans are in the DOM and leave raw LaTeX on first render — this is
  // especially visible when this element is mounted inside complex-rubric, which
  // swaps its innerHTML and re-defines the inner element. Observing the DOM and
  // typesetting after each commit keeps math in sync regardless of timing.
  _scheduleMathRender = () => {
    if (this._mathRenderPending) return;
    this._mathRenderPending = true;

    requestAnimationFrame(() => {
      if (this._mathObserver) {
        this._mathObserver.disconnect();
      }
      renderMath(this);
      this._mathRenderPending = false;
      setTimeout(() => {
        if (this._mathObserver) {
          this._mathObserver.observe(this, { childList: true, subtree: true });
        }
      }, 50);
    });
  };

  _initMathObserver() {
    if (this._mathObserver) return;
    this._mathObserver = new MutationObserver(this._scheduleMathRender);
    this._mathObserver.observe(this, { childList: true, subtree: true });
  }

  _disconnectMathObserver() {
    if (this._mathObserver) {
      this._mathObserver.disconnect();
      this._mathObserver = null;
    }
  }

  set model(s) {
    this._model = s;
    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this._session, !!this._model));

    this._render();
  }

  set session(s) {
    this._session = s;
  }

  get session() {
    return this._session;
  }

  connectedCallback() {
    this._initMathObserver();
    this._render();
  }

  _render() {
    this._initMathObserver();

    const el = React.createElement(Main, { model: this._model, session: this._session });

    if (!this._root) {
      this._root = createRoot(this);
    }
    this._root.render(el);
  }

  disconnectedCallback() {
    this._disconnectMathObserver();
    if (this._root) {
      this._root.unmount();
    }
  }
}
