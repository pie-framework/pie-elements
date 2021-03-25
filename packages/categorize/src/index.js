import React from 'react';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/math-rendering';
import {
  SessionChangedEvent,
  ModelSetEvent
} from '@pie-framework/pie-player-events';
import CategorizeComponent from './categorize';

export default class Categorize extends HTMLElement {
  set model(m) {
    this._model = m;

    this.dispatchEvent(
      new ModelSetEvent(
        this.tagName.toLowerCase(),
        this.isComplete(),
        !!this._model
      )
    );
    this.render();
  }

  isComplete() {
    if (!this._session) {
      return false;
    }

    return (
      Array.isArray(this._session.answers) && this._session.answers.length > 0
    );
  }

  set session(s) {
    if (s && !s.answers) {
      s.answers = [];
    }

    this._session = s;
    this.render();
  }

  changeAnswers(answers) {
    this._session.answers = answers;

    this.dispatchEvent(
      new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete())
    );

    this.render();
  }

  onShowCorrectToggle() {
    renderMath(this);
  }

  render() {
    if (this._model && this._session) {
      const el = React.createElement(CategorizeComponent, {
        model: this._model,
        session: this._session,
        onAnswersChange: this.changeAnswers.bind(this),
        onShowCorrectToggle: this.onShowCorrectToggle.bind(this),
      });
      ReactDOM.render(el, this, () => {
        renderMath(this);
      });
    }
  }
}
