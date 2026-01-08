import React from 'react';
import { createRoot } from 'react-dom/client';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/math-rendering';

import Main from './main';

export { Main as Component };

export default class Graphing extends HTMLElement {
  constructor() {
    super();
    this._root = null;
  }

  set model(m) {
    this._model = m;
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

    const el = React.createElement(Main, {
      model: this._model,
      session: this._session,
      onAnswersChange: this.changeAnswers,
    });

    if (!this._root) {
      this._root = createRoot(this);
    }
    this._root.render(el);
    queueMicrotask(() => {
      renderMath(this);
    });
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
