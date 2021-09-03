import * as dataConverter from './data-converter';
import * as pointChooser from './number-line/point-chooser';
import * as tickUtils from './number-line/graph/tick-utils';

import {
  lineIsSwitched,
  switchGraphLine,
  toGraphFormat,
  toSessionFormat
} from './data-converter';

import Graph from './number-line/graph';
import NumberLineComponent from './number-line';
import React from 'react';
import ReactDOM from 'react-dom';
import RootComponent from './number-line';
import cloneDeep from 'lodash/cloneDeep';
import { renderMath } from '@pie-lib/math-rendering';

//Expose some additional modules for configuration
export { Graph, NumberLineComponent, tickUtils, dataConverter, pointChooser };

export default class NumberLine extends HTMLElement {
  constructor() {
    super();
  }

  set model(m) {
    this._model = m;
    this._applyInitialElements();
    this._render();
    this.dispatch('model-set');
  }

  set session(s) {
    this._session = s;
    this._applyInitialElements();
    this._render();
  }

  connectedCallback() {
    this._render();
  }

  isComplete() {
    return this._session ? (this._session.answer || []).length > 0 : false;
  }

  dispatch(type) {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        detail: {
          complete: this.isComplete()
        }
      })
    );
  }

  dispatchSessionChanged() {
    this.dispatch('session-changed');
  }

  addElement(data) {
    if (!this._session) {
      return;
    }

    this._session.answer = this._session.answer || [];
    this._session.answer.push(toSessionFormat(data));
    this.dispatchSessionChanged();
    this._render();
  }

  moveElement(index, el, position) {
    let answer = this._session.answer[index];

    if (!answer) {
      throw new Error('cant find element at index: ', index);
    }

    if (el.type === 'line' && position.left === position.right) {
      this._render();
      return;
    }

    //set the new position
    el.position = position;

    let update =
      el.type === 'line' && lineIsSwitched(el) ? switchGraphLine(el) : el;

    this._session.answer.splice(index, 1, toSessionFormat(update));

    this.dispatchSessionChanged();
    this._render();
  }

  deleteElements(indices) {
    this._session.answer = this._session.answer.filter((v, index) => {
      return !indices.some(d => d === index);
    });
    this.dispatchSessionChanged();
    this._render();
  }

  undoElement() {
    this._session.answer.pop();
    this.dispatchSessionChanged();
    this._render();
  }

  clearElements() {
    this._session.answer = [];
    this.dispatchSessionChanged();
    this._render();
  }

  _applyInitialElements() {
    if (
      this._model &&
      this._model.graph &&
      this._model.graph.initialElements &&
      this._session &&
      !this._session.answer
    ) {
      this._session.answer = cloneDeep(this._model.graph.initialElements);
    }
  }

  _render() {
    try {
      if (this._model && this._session) {
        if (!this._session.answer) {
          this._applyInitialElements();
        }

        let answer = (this._session.answer || []).map(toGraphFormat);
        let model = cloneDeep(this._model);
        model.correctResponse =
          model.correctResponse && model.correctResponse.map(toGraphFormat);

        let props = {
          model,
          answer,
          onAddElement: this.addElement.bind(this),
          onMoveElement: this.moveElement.bind(this),
          onDeleteElements: this.deleteElements.bind(this),
          onUndoElement: this.undoElement.bind(this),
          onClearElements: this.clearElements.bind(this)
        };

        let el = React.createElement(RootComponent, props);
        ReactDOM.render(el, this, () => {
          renderMath(this);
        });
      }
    } catch (e) {
      throw e;
    }
  }
}
