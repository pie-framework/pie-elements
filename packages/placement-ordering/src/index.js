import React from 'react';
import { createRoot } from 'react-dom/client';
import compact from 'lodash/compact';
import debug from 'debug';
import { renderMath } from '@pie-lib/math-rendering';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import Main from './main';

const log = debug('pie-elements:placement-ordering');

export const isValidSession = ({ model, session }) => {
  const { config } = model;

  const compactSessionValues = (session && compact(session.value)) || [];
  const completeSession = compactSessionValues.length === model.choices.length;

  // if it includes targets, it doesn't have to contain all the choices selected (eg: only 2 targets were filled)
  // but if it does not include targets, it's a must to have all choices selected
  return config.includeTargets || completeSession;
};

export default class Ordering extends HTMLElement {
  constructor() {
    super();
    this._root = null;
  }

  isComplete = (value) => value && compact(value).length === this._model.completeLength;

  sessionChange = (session) => {
    this._session.value = session.value;
    this.render();
    this.dispatchEvent(
      new SessionChangedEvent(this.tagName.toLowerCase(), this._session && this.isComplete(this._session.value)),
    );
  };

  set model(newModel) {
    this._model = newModel;

    this.render();
    this.dispatchEvent(
      new CustomEvent('model-set', {
        bubbles: true,
        detail: {
          complete: false,
        },
      }),
    );
  }

  set session(newSession) {
    this._session = newSession;
    this.render();
  }

  get session() {
    return this._session;
  }

  render() {
    if (this._model && this._session) {
      log('[render] session: ', this._session.value);
      log('[render] model: ', this._model);

      const element = React.createElement(Main, {
        model: this._model,
        session: this._session,
        onSessionChange: this.sessionChange,
      });

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(element);
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
