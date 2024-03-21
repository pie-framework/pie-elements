import React from 'react';
import ReactDOM from 'react-dom';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import { findSectionsInSolutionSet, removeInvalidAnswers } from './utils';
import Main from './main';
import { set } from 'lodash';

export { Main as Component };

export default class Graphing extends HTMLElement {
  constructor() {
    super();
  }

  /*
   * Function to set model
   * @param {object} m - Model object
   * */
  set model(m) {
    this._model = m;
    this._render();
  }

  /*
   * Function to set session
   * @param {object} s - Session object
   * */
  set session(s) {
    this._session = s;
    if (!this._session.answer) {
      this._session.answer = [];
    }
    const { answer } = this._session || {};
    const { gssLineData, domain, range } = this._model;
    let section = answer && answer.filter((mark) => mark.type === 'polygon').length > 0;
    if (gssLineData.numberOfLines === 1) {
      this._model.gssData = {
        numberOfLines: 1,
        selectedTool: section ? 'solutionSet' : 'lineA',
        sections: [],
        lineA: {
          lineType: answer && answer.length > 0 ? answer[0].fill : 'Solid',
        },
      };
    } else {
      this._model.gssData = {
        numberOfLines: 2,
        selectedTool: section ? 'solutionSet' : 'lineA',
        sections: [],
        lineA: {
          lineType: answer && answer.length > 0 ? answer[0].fill : 'Solid',
        },
        lineB: {
          lineType: answer && answer.length > 1 ? answer[1].fill : 'Solid',
        },
      };
    }
    if (section) {
      this._model.gssData = findSectionsInSolutionSet(this._model.gssData, answer, domain, range);
    }
    this._render();
  }

  /*
   * Function to get session
   * */
  get session() {
    return this._session;
  }

  connectedCallback() {
    this._render();
  }

  /*
   * Is complete function
   * @param {object} answer - Answer object
   * */
  isComplete = (answer) => Array.isArray(answer) && answer.length > 0;

  /*
   * Callback function to change answers
   * @param {object} answer - Answer object
   * @param {boolean} isUndoOperation - Boolean value to check if undo operation is performed
   * */
  changeAnswers = (answer, isUndoOperation) => {
    // avoid removeInvalidObjects when undo or redo operations are executed
    // in order to preserve the logic of undo and redo
    const { gssData } = this._model;
    if (gssData.selectedTool === 'lineA' && answer.length > 0) {
      answer[0].fill = gssData['lineA'].lineType;
    }
    if (gssData.selectedTool === 'lineB' && answer.length > 1) {
      answer[1].fill = gssData['lineB'].lineType;
    }
    if (answer.length === 0) {
      gssData.selectedTool = 'lineA';
      this._model.gssData = gssData;
    }
    if (!isUndoOperation) {
      this._session.answer = removeInvalidAnswers(answer);
    } else {
      this._session.answer = answer;
    }
    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete(this._session.answer)));
    this._render();
  };

  /*
   * Function to set gssData object and session object
   * @param {object} gssData - GSS Data object
   * @param {object} session - Session object
   * */
  setGssData = (gssData, session) => {
    this._model.gssData = gssData;
    this._session = session;
    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete(this._session.answer)));
    this._render();
  };

  /*
   * Render function
   * */
  _render() {
    if (!this._model || !this._session) {
      return;
    }
    const el = React.createElement(Main, {
      model: this._model,
      session: this._session,
      onAnswersChange: this.changeAnswers,
      setGssData: this.setGssData,
    });
    ReactDOM.render(el, this, () => {
      renderMath(this);
    });
  }
}
