import React from 'react';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import Main from './main';

export const isComplete = (session, model) => {
  if (!session || !session.value) {
    return false;
  }

  const answered = Object.values(session.value || {}).some((value) => !!value);

  return answered;
};

export default class InlineDropdown extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;
  }

  set model(m) {
    this._model = m;
    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), isComplete(this._session), !!this._model));

    this._render();
  }

  set session(s) {
    this._session = s;
    this._render();
  }

  get session() {
    return this._session;
  }

  _render = () => {
    if (this._model && this._session) {
      let elem = React.createElement(Main, {
        model: this._model,
        value: this._session.value,
        onChange: this.changeSession,
      });

      ReactDOM.render(elem, this, () => {
        renderMath(this);
      });
    }
  };

  dispatchChangedEvent = () => {
    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), isComplete(this._session)));
  };

  changeSession = (value) => {
    this.session.value = value;
    this.dispatchChangedEvent();
    this._render();
  };

  connectedCallback() {
    this._render();
  }
}
