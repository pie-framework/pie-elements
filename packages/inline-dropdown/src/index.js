import React from 'react';
import ReactDOM from 'react-dom';
import {
  ModelSetEvent,
  SessionChangedEvent
} from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/math-rendering';
import InlineDropdown from './inline-dropdown';

export default class RootInlineDropdown extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;
  }

  set model(m) {
    this._model = m;
    this.dispatchEvent(
      new ModelSetEvent(
        this.tagName.toLowerCase(),
        this.session && !!this.session.value,
        !!this._model
      )
    );

    this._render();
  }

  set session(s) {
    this._session = s;
    this._render();
  }

  get session() {
    return this._session;
  }

  _render = () => {
    if (this._model && this._session) {
      let elem = React.createElement(InlineDropdown, {
        prompt: this._model.prompt,
        rationale: this._model.rationale,
        teacherInstructions: this._model.teacherInstructions,
        disabled: this._model.disabled,
        markup: this._model.markup,
        mode: this._model.mode,
        choices: this._model.choices,
        value: this._session.value,
        feedback: this._model.feedback,
        onChange: this.changeSession
      });
      ReactDOM.render(elem, this, () => {
        renderMath(this);
      });
    }
  };

  dispatchChangedEvent = () => {
    this.dispatchEvent(
      new SessionChangedEvent(
        this.tagName.toLowerCase(),
        this.session && !!this.session.value
      )
    );
  };

  changeSession = value => {
    this.session.value = value;
    this.dispatchChangedEvent();
    this._render();
  };

  connectedCallback() {
    this._render();
  }
}
