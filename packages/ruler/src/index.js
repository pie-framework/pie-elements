import { ModelSetEvent } from '@pie-framework/pie-player-events';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
export { Root as RulerComponent };

export default class Ruler extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;
  }

  connectedCallback() {
    this.render();
  }

  set model(m) {
    this._model = m;
    this.dispatchEvent(
      new ModelSetEvent(
        this.tagName.toLowerCase(),
        this._session,
        !!this._model
      )
    );

    this.render();
  }

  render() {
    if (this._model) {
      let elem = React.createElement(Root, {
        model: this._model
      });

      ReactDOM.render(elem, this);
    }
  }
}
