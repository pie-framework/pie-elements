import React from 'react';
import ReactDOM from 'react-dom';
import { SessionChangedEvent, ModelSetEvent } from '@pie-framework/pie-player-events';
import Main from './main';
import cloneDeep from 'lodash/cloneDeep';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';

export default class FractionModel extends HTMLElement {
  set model(m) {
    this._model = m;
    this.render();
  }

  get model() {
    return this._model;
  }

  set session(s) {
    this._session = s;
    this.render();
  }

  get session() {
    return this._session;
  }

  isSessionComplete(session, model) {
    // a method to check if student answered the question
    let answers = session && session.answers;
    let complete = model.allowedStudentConfig ? (answers.noOfModel > 0 && answers.partsPerModel > 0) : true;
    complete = complete && Array.isArray(answers.selection) && answers.selection.length > 0;
    return complete;
  }

  onSessionChange(session) {
    // you can add an extra step here to validate session
    this._session.answers = session && session.answers;
    let complete = this.isSessionComplete(this._session, this._model);

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), complete));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (this._model && this._session) {
      let model = cloneDeep(this._model);
      const el = React.createElement(Main, {
        model,
        session: this._session,
        onSessionChange: this.onSessionChange.bind(this),
      });

      ReactDOM.render(el, this, () => {
        renderMath(this);
      });
    }
  }
}
