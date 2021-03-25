import React from 'react';
import ReactDOM from 'react-dom';
import {
  SessionChangedEvent,
  ModelSetEvent
} from '@pie-framework/pie-player-events';
import Main from './main';
import { renderMath } from '@pie-lib/math-rendering';

export default class SelectText extends HTMLElement {
  constructor() {
    super();
  }

  set model(m) {
    this._model = m;

    this.render();
    this.dispatchEvent(
      new ModelSetEvent(
        this.tagName.toLowerCase(),
        this.isSessionComplete(),
        this._model !== undefined
      )
    );
  }

  set session(s) {
    this._session = s;
    if (!Array.isArray(this._session.selectedTokens)) {
      this._session.selectedTokens = [];
    }
    this.render();
  }

  isSessionComplete() {
    const { selectedTokens } = this._session || {};
    return Array.isArray(selectedTokens) && selectedTokens.length > 0;
  }

  selectionChanged(selection) {
    this._session.selectedTokens = selection;

    this.dispatchEvent(
      new SessionChangedEvent(
        this.tagName.toLowerCase(),
        this.isSessionComplete()
      )
    );
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (this._model && this._session) {
      const el = React.createElement(Main, {
        model: this._model,
        session: this._session,
        onSelectionChange: this.selectionChanged.bind(this)
      });

      ReactDOM.render(el, this, () => {
        renderMath(this);
      });
    }
  }
}
