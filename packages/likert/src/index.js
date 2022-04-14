import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/math-rendering';

export const isComplete = (session) =>
  !!(session && session.value && session.value.length);

export default class Likert extends HTMLElement {
  constructor() {
    super();
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
    const complete = isComplete(this._session, this._model);
    this.dispatchEvent(
      new SessionChangedEvent(this.tagName.toLowerCase(), complete)
    );
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
