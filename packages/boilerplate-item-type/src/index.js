import React from 'react';
import { createRoot } from 'react-dom/client';
import { SessionChangedEvent, ModelSetEvent } from '@pie-framework/pie-player-events';
import Main from './main';
import { renderMath } from '@pie-lib/math-rendering';

export default class BoilerplateItemType extends HTMLElement {
  constructor() {
    super();
    this._root = null;
  }

  set model(m) {
    this._model = m;

    this.render();
    this.dispatchEvent(
      new ModelSetEvent(this.tagName.toLowerCase(), this.isSessionComplete(), this._model !== undefined),
    );
  }

  get model() {
    return this._model;
  }

  set session(s) {
    this._session = s;

    this.render();
  }

  get session() {
    return this._session;
  }

  isSessionComplete() {
    // a method to check if student answered the question
    return true;
  }

  onSessionChange(session) {
    // you can add an extra step here to validate session
    this._session = session;

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isSessionComplete()));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (this._model && this._session) {
      const el = React.createElement(Main, {
        model: this._model,
        session: this._session,
        onSessionChange: this.onSessionChange.bind(this),
      });

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(el);
      queueMicrotask(() => {
        renderMath(this);
      });
    }
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
