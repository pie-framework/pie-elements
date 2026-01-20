import React from 'react';
import { createRoot } from 'react-dom/client';
import debug from 'debug';
import _ from 'lodash';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';

import defaults from '../configure/lib/defaults';
import Main from './main';

const log = debug('pie-ui:math-inline');

export { Main as Component };

export default class MathInline extends HTMLElement {
  constructor() {
    super();
    this._root = null;
    this._configuration = defaults.configuration;
    this.sessionChangedEventCaller = _.debounce(() => {
      this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), true));
    }, 1000);
  }

  setLangAttribute() {
    const language = this._model && typeof this._model.language ? this._model.language : '';
    const lang = language ? language.slice(0, 2) : 'en';
    this.setAttribute('lang', lang);

    // set the lang attribute for the nearest parent div with class 'player-container' for MPI items as per PD-2483
    const playerContainer = this.closest('.player-container');
    if (playerContainer) {
      playerContainer.setAttribute('lang', lang);
    }
  }

  set model(m) {
    this._model = m;
    this.dispatchEvent(new ModelSetEvent(this._model, true, !!this._model));
    this.setLangAttribute();
    this._render();
  }

  set session(s) {
    this._session = s;
    this._render();
  }

  get session() {
    return this._session;
  }

  set configuration(c) {
    this._configuration = c;
    this._render();
  }

  sessionChanged(s) {
    Object.keys(s).map((key) => {
      this._session[key] = s[key];
    });

    this.sessionChangedEventCaller();
    log('session: ', this._session);
  }

  connectedCallback() {
    this.setAttribute('aria-label', 'Math Response Question');
    this.setAttribute('role', 'region');

    this._render();
  }

  _render() {
    if (!this._model || !this._session) {
      return;
    }

    const el = React.createElement(Main, {
      model: this._model,
      session: this._session,
      configuration: this._configuration,
      onSessionChange: this.sessionChanged.bind(this),
    });

    if (!this._root) {
      this._root = createRoot(this);
    }
    this._root.render(el);
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
