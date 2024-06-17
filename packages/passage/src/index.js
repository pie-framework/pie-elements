import { ModelSetEvent } from '@pie-framework/pie-player-events';
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

  set model(s) {
    this._model = s;
    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this._session, !!this._model));

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
    const { passages = [], showTeacherInstructions = false } = this._model;

    if (this._model.passages.length > 0) {
      const passagesTabs = passages.map((passage, index) => ({
        id: index,
        title: passage.title,
        subtitle: passage.subtitle,
        author: passage.author,
        text: passage.text,
        teacherInstructions: passage.teacherInstructions || '',
      }));
      const elem = React.createElement(StimulusTabs, {
        tabs: passagesTabs,
        showTeacherInstructions,
      });

      ReactDOM.render(elem, this);
    }
  }
}
