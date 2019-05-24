import {
  ModelUpdatedEvent,

} from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';
import Rubric from '@pie-lib/rubric';
import debug from 'debug';


export default class RubricElement extends HTMLElement {


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
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (this._model) {
      const element = React.createElement(Rubric, {
        model: this._model,
        onChange: this.onModelChanged
      });
      ReactDOM.render(element, this);
    }
  }
}
