import React from 'react';
import ReactDOM from 'react-dom';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';

import Main from './main';

export default class InlineDropdown extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;
  }

  set model(m) {
    this._model = m;
    this.dispatchEvent(
      new ModelSetEvent(this.tagName.toLowerCase(), this.session && !!this.session.value, !!this._model),
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
      let elem = React.createElement(Main, {
        choices: this._model.choices,
        disabled: this._model.disabled,
        displayType: this._model.displayType,
        feedback: this._model.feedback,
        language: this._model.language,
        markup: this._model.markup,
        maxLengthPerChoice: this._model.maxLengthPerChoice,
        maxLengthPerChoiceEnabled: this._model.maxLengthPerChoiceEnabled,
        mode: this._model.mode,
        note: this._model.note,
        onChange: this.changeSession,
        playerSpellCheckEnabled: this._model.playerSpellCheckEnabled,
        prompt: this._model.prompt,
        rationale: this._model.rationale,
        role: this._model.role,
        showNote: this._model.showNote,
        teacherInstructions: this._model.teacherInstructions,
        value: this._session.value,
      });

      ReactDOM.render(elem, this, () => {
        renderMath(this);
      });
    }
  };

  dispatchChangedEvent = () => {
    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.session && !!this.session.value));
  };

  changeSession = (value) => {
    this.session.value = value;
    this.dispatchChangedEvent();
    this._render();
  };

  connectedCallback() {
    this.setAttribute('aria-label', 'Fill in the Blank Question');
    this.setAttribute('role', 'region');

    this._render();
  }
}
