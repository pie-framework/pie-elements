import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

export default class SelectTextConfigure extends HTMLElement {
  constructor() {
    super();
  }

  set model(m) {
    this._model = m;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  modelChanged(m) {
    this._model = m;
    this.dispatchEvent(new ModelUpdatedEvent(this._model), true);
    this.render();
  }

  render() {
    if (this._model) {
      const el = React.createElement(Main, {
        model: this._model,
        onChange: this.modelChanged.bind(this)
      });

      ReactDOM.render(el, this);
    }
  }
}
