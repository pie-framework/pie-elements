import React from 'react';
import { createRoot } from 'react-dom/client';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import Main from './main';
import cloneDeep from 'lodash/cloneDeep';
import { renderMath } from '@pie-lib/math-rendering';
import FractionModelChart from './fraction-model-chart';

// Export FractionModelChart for use in configure
export { FractionModelChart };

export default class FractionModel extends HTMLElement {
  constructor() {
    super();
    this._root = null;
  }

  set model(m) {
    this._model = m;
    this._render();
  }

  get model() {
    return this._model;
  }

  set session(s) {
    this._session = s;
    this._render();
  }

  get session() {
    return this._session;
  }

  /*
   * Method to check if student answered the question
   * @param {session} session contains the session object
   * @param {model} model contains the model object
   * */
  isSessionComplete(session, model) {
    const answers = session && session.answers;
    const configComplete = model.allowedStudentConfig ? answers.noOfModel > 0 && answers.partsPerModel > 0 : true;
    const responseComplete = Array.isArray(answers.response) && answers.response.length > 0;
    return configComplete && responseComplete;
  }

  /*
   * Session change event handler
   * @param {session} session contains the session object
   * */
  onSessionChange(session) {
    this._session.answers = session && session.answers;
    const complete = this.isSessionComplete(this._session, this._model);
    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), complete));
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (this._model && this._session) {
      let model = cloneDeep(this._model);
      const el = React.createElement(Main, {
        model,
        session: this._session,
        onSessionChange: this.onSessionChange.bind(this),
      });

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(el);
      queueMicrotask(() => {
        renderMath(this);
      });
    }
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
