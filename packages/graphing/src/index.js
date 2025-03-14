import React from 'react';
import ReactDOM from 'react-dom';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';

import { removeInvalidAnswers } from './utils';
import Main from './main';

export { Main as Component };

export default class Graphing extends HTMLElement {
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

  connectedCallback() {
    this._render();
  }

  isComplete = (answer) => Array.isArray(answer) && answer.length > 0;

  changeAnswers = (answer, isUndoOperation) => {
    // avoid removeInvalidObjects when undo or redo operations are executed
    // in order to preserve the logic of undo and redo
    if (!isUndoOperation) {
      this._session.answer = removeInvalidAnswers(answer);
    } else {
      this._session.answer = answer;
    }

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

    ReactDOM.render(el, this, () => {
      renderMath(this);
    });
  }
}
