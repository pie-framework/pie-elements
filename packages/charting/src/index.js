import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './main';
import { SessionChangedEvent, ModelSetEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/math-rendering';

export { Main as Component };

export default class Graphing extends HTMLElement {
  constructor() {
    super();
    this._root = null;
    this._mathObserver = null;
    this._mathRenderPending = false;
  }

  // The title and axis labels are injected synchronously via dangerouslySetInnerHTML,
  // but createRoot().render() commits asynchronously, so a queueMicrotask(renderMath)
  // would run before the LaTeX spans are in the DOM and leave raw LaTeX on first render.
  // Observing the DOM and typesetting after each commit keeps math in sync regardless of timing.
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

  set model(m) {
    this._model = m;

    if (this._session && this.isComplete(this._session.answer)) {
      this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), true, !!this._model));
    } else {
      this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), false, !!this._model));
    }

    this._render();
  }

  set session(s) {
    this._session = s;
    this._render();
  }

  get session() {
    return this._session;
  }

  connectedCallback() {
    this._initMathObserver();
    this._render();
  }

  isComplete = (answer) => Array.isArray(answer) && answer.length > 0;

  changeAnswers = (answer) => {
    this._session.answer = answer;

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete(this._session.answer)));

    this._render();
  };

  _render() {
    if (!this._model || !this._session) {
      return;
    }

    this._initMathObserver();

    const modelClone = {
      ...this._model,
      data: this._model.data ? [...this._model.data] : this._model.data,
    };

    const el = React.createElement(Main, {
      model: modelClone,
      categories: this._session.answer,
      onAnswersChange: this.changeAnswers,
    });

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
