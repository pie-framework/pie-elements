import React from 'react';
import ReactDOM from 'react-dom';
import {SessionChangedEvent} from '@pie-framework/pie-player-events';
import {renderMath} from '@pie-lib/math-rendering';
import Main from './Main';

export const isComplete = session => {
  if (!session || !session.value) {
    return false;
  }
  return !!(Object.keys(session.value).length);
};

export default class Matrix extends HTMLElement {
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

  sessionChanged({matrixKey, matrixValue}) {
    const matrixRowKey = matrixKey.split('-')[0];
    const sessionValueClone = Object
      .keys(this._session.value || {})
      .reduce((acc, key) => {
        if (!key.startsWith(matrixRowKey)) {
          acc[key] = this._session.value[key];
        }
        return acc;
      }, {});
    sessionValueClone[matrixKey] = matrixValue;
    this._session.value = sessionValueClone;
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
