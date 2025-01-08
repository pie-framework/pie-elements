import { ModelSetEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import React from 'react';
import ReactDOM from 'react-dom';

import StimulusTabs from './stimulus-tabs';

export default class PiePassage extends HTMLElement {
  constructor() {
    super();
    this._model = {
      passages: [],
    };
    this._session = null;
  }

  setLangAttribute() {
    const language = this._model && typeof this._model.language ? this._model.language : '';
    const lang = language ? language.slice(0, 2) : 'en';
    this.setAttribute('lang', lang);
  }

  set model(s) {
    this._model = s;
    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this._session, !!this._model));
    this.setLangAttribute();

    this._render();
  }

  set session(s) {
    this._session = s;
  }

  connectedCallback() {
    this.setAttribute('aria-label', 'Passage');
    this.setAttribute('role', 'region');
    this._render();
  }

  _render() {
    const { passages = [] } = this._model;

    if (this._model.passages.length > 0) {
      const passagesTabs = passages.map((passage, index) => ({
        id: index,
        ...passage,
      }));

      const elem = React.createElement(StimulusTabs, {
        tabs: passagesTabs,
      });

      ReactDOM.render(elem, this, () => renderMath(this));
    }
  }
}
