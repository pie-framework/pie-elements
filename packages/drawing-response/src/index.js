import React from 'react';
import ReactDOM from 'react-dom';
import isEmpty from 'lodash/isEmpty';
import { renderMath } from '@pie-lib/math-rendering';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';

import DrawingResponseComponent from './drawing-response';

export default class DrawingResponse extends HTMLElement {
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
    return this._session && (!isEmpty(this._session.drawables) || !isEmpty(this._session.texts));
  }

  sessionChanged = (update) => {
    this._session.drawables = update.drawables;
    this._session.texts = update.texts;

    this.dispatchEvent(
      new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete())
    );

    this._render();
  };

  set session(s) {
    this._session = s;
    this._render();
  }

  get session() {
    return this._session;
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (this._model && this._session) {
      const el = React.createElement(DrawingResponseComponent, {
        model: this._model,
        session: this._session,
        onSessionChange: this.sessionChanged
      });

      ReactDOM.render(el, this, () => {
        renderMath(this);
      });
    }
  }
}
