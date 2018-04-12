import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';

export default class extends HTMLElement {

  constructor() {
    super();
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(m) {
    this._model = m;
    this._render();
  }

  onModelChanged(m) {
    this._model = m;
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  _render() {
    let element = React.createElement(Root, {
      model: this._model,
      onModelChanged: this.onModelChanged
    });
    ReactDOM.render(element, this);
  }
}