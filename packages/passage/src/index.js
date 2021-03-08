import { ModelSetEvent } from '@pie-framework/pie-player-events';
import React from 'react';
import ReactDOM from 'react-dom';
import StimulusTabs from './stimulus-tabs';
export default class PiePassage extends HTMLElement {
  constructor() {
    super();
    this._model = {
      passages: []
    };
    this._session = null;
  }

  set model(s) {
    this._model = s;
    this.dispatchEvent(
      new ModelSetEvent(
        this.tagName.toLowerCase(),
        this._session,
        !!this._model
      )
    );

    this._render();
  }

  set session(s) {
    this._session = s;
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (this._model.passages.length > 0) {
      const passagesTabs = this._model.passages.map((passage, index) => {
        return {
          id: index,
          title: passage.title,
          text: passage.text
        };
      });
      let elem = React.createElement(StimulusTabs, { tabs: passagesTabs });
      ReactDOM.render(elem, this);
    }
  }
}
