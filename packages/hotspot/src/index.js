import React from 'react';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/math-rendering';
import {
  SessionChangedEvent,
  ModelSetEvent
} from '@pie-framework/pie-player-events';

import HotspotComponent from './hotspot';
import { updateSessionValue } from './session-updater';

export default class Hotspot extends HTMLElement {
  set model(m) {
    this._model = m;

    this.dispatchEvent(
      new ModelSetEvent(
        this.tagName.toLowerCase(),
        this.isComplete(),
        !!this._model
      )
    );
    this._render();
  }

  isComplete() {
    if (!this._session) {
      return false;
    }

    return (
      Array.isArray(this._session.answers) && this._session.answers.length > 0
    );
  }

  set session(s) {
    if (s && !s.answers) {
      s.answers = [];
    }

    this._session = s;
    this._render();
  }

  get session() {
    return this._session;
  }

  onSelectChoice(data) {
    updateSessionValue(this._session, this._model, data);

    this.dispatchEvent(
      new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete())
    );

    this._render();
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (this._model && this._session) {
      const el = React.createElement(HotspotComponent, {
        model: this._model,
        session: this._session,
        onSelectChoice: this.onSelectChoice.bind(this)
      });

      ReactDOM.render(el, this, () => {
        renderMath(this);
      });
    }
  }
}
