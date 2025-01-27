import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';

export { Main as Component };

export const isComplete = (session, model) => {
  const ids = model?.rows?.map((r) => r.id) || [];

  return ids.reduce((acc, id) => {
    if (!acc) {
      return false;
    }

    const arr = session.answers && session.answers[id];
    const hasChoice = Array.isArray(arr) && arr.includes(true);

    return hasChoice && acc;
  }, true);
};

export default class Match extends HTMLElement {
  constructor() {
    super();
  }

  set model(m) {
    // config object props should be part of the model props
    // model.config should be no longer used
    this._model = { ...m, ...(m?.config || {}) };
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
    this._session.answers = s.answers;
    const complete = isComplete(this._session, this._model);

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), complete));

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

    ReactDOM.render(el, this, () => {
      renderMath(this);
    });
  }
}
