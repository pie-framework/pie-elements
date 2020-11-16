import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';

import Main from './main';

export default class MultiTraitRubricElement extends HTMLElement {
  constructor() {
    super();
    this._model = {};
    this._configuration = {};
  }

  set model(s) {
    this._model = s;
    this._render();
  }

  onModelChanged = (m) => {
    this._model = m;
    this._render();
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  _render() {
    if (this._model) {
      let element = React.createElement(Main, {
        model: this._model,
        configuration: this._configuration,
        onModelChanged: this.onModelChanged,
        onConfigurationChanged: this.onConfigurationChanged,
      });

      ReactDOM.render(element, this);
    }
  }
}
