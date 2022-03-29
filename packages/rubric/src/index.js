import Rubric from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';


export default class RubricRender extends HTMLElement {

  constructor() {
    super();
    debug.log('constructor called');
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = s;
    this._render();
  }

  onModelChanged(m) {
    this._model = m;
    this._render();
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (this._model) {
      const el = (
        <Rubric value={this._model} />
      );

      ReactDOM.render(el, this);
    }
  }
}
