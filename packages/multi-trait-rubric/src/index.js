import React from 'react';
import ReactDOM from 'react-dom';
import { ModelSetEvent } from '@pie-framework/pie-player-events';
import Main from './main';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';

export default class MultiTraitRubric extends HTMLElement {
  constructor() {
    super();
    this._model = {};
    this._session = null;
  }

  set model(s) {
    this._model = s;
    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this._session, !!this._model));

    this._render();
  }

  set session(s) {
    this._session = s;
  }

  get session() {
    return this._session;
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const el = React.createElement(Main, { model: this._model, session: this._session });

    ReactDOM.render(el, this, () => {
      renderMath(this);
    });
  }
}
