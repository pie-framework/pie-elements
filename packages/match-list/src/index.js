import React from 'react';
import { createRoot } from 'react-dom/client';
import debug from 'debug';
import Main from './main';

import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/math-rendering';

const log = debug('pie-ui:graph-lines');

export { Main as Component };

export const isComplete = (session, model) => {
  if (!session) {
    return false;
  }

  const value = session.value;
  let complete = true;

  if (value) {
    (model.config.prompts || []).forEach((prompt) => {
      if (!Number.isFinite(value[prompt.id])) {
        complete = false;
      }
    });
  }

  return complete;
};

export default class MatchList extends HTMLElement {
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

  sessionChanged(s) {
    this._session.value = s.value;

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), isComplete(this._session, this._model)));

    log('session: ', this._session);
    this._render();
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (!this._model || !this._session) {
      return;
    }

    const el = React.createElement(Main, {
      model: this._model,
      session: this._session,
      onSessionChange: this.sessionChanged.bind(this),
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
