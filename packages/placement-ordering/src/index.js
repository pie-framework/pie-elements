import React from 'react';
import { createRoot } from 'react-dom/client';
import { compact } from 'lodash-es';
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
    this._mathObserver = null;
    this._mathRenderPending = false;
  }

  _scheduleMathRender = () => {
    if (this._mathRenderPending) return;
    this._mathRenderPending = true;

    requestAnimationFrame(() => {
      if (this._mathObserver) {
        this._mathObserver.disconnect();
      }
      renderMath(this);
      this._mathRenderPending = false;
      setTimeout(() => {
        if (this._mathObserver) {
          this._mathObserver.observe(this, { childList: true, subtree: true });
        }
      }, 50);
    });
  };

  _initMathObserver() {
    if (this._mathObserver) return;
    this._mathObserver = new MutationObserver(this._scheduleMathRender);
    this._mathObserver.observe(this, { childList: true, subtree: true });
  }

  _disconnectMathObserver() {
    if (this._mathObserver) {
      this._mathObserver.disconnect();
      this._mathObserver = null;
    }
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

      this._initMathObserver();

      const element = React.createElement(Main, {
        model: this._model,
        session: this._session,
        onSessionChange: this.sessionChange,
      });

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(element);
    }
  }

  connectedCallback() {
    this._initMathObserver();
    this.render();
  }

  disconnectedCallback() {
    this._disconnectMathObserver();
    if (this._root) {
      this._root.unmount();
      this._root = null;
    }
  }
}
