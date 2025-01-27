import React from 'react';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import { SessionChangedEvent, ModelSetEvent } from '@pie-framework/pie-player-events';
import CategorizeComponent from './categorize';

export default class Categorize extends HTMLElement {
  set model(m) {
    this._model = m;

    this.eliminateBlindAnswersFromSession();
    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this.isComplete(), !!this._model));
    this.render();
  }

  isComplete() {
    if (!this._session || !this._session.answers) {
      return false;
    }

    if (!Array.isArray(this._session.answers)) {
      return false;
    }

    return this._session.answers.some((answer) => answer.choices && answer.choices.length > 0);
  }

  set session(s) {
    if (s && !s.answers) {
      s.answers = [];
    }

    this._session = s;
    this.render();
  }

  get session() {
    return this._session;
  }

  eliminateBlindAnswersFromSession() {
    const { answers = [] } = this._session || {};
    const { choices = [] } = this._model || {};

    const mappedChoices = choices.map((c) => c.id) || [];
    const filteredAnswers = answers.map((answer) => {
      const answerChoices = answer?.choices || [];
      answer.choices = answerChoices.filter((c) => mappedChoices.includes(c));

      return answer;
    });

    if (filteredAnswers.length > 0) {
      this.changeAnswers(filteredAnswers);
    }
  }

  changeAnswers(answers) {
    this._session.answers = answers;

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete()));

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
