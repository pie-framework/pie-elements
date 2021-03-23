import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import debug from 'debug';
import _ from 'lodash';

import {
  ModelSetEvent,
  SessionChangedEvent,
} from '@pie-framework/pie-player-events';
import defaults from '../configure/lib/defaults';

const log = debug('pie-ui:math-inline');

export { Main as Component };

export default class MathInline extends HTMLElement {
  constructor() {
    super();
    this._configuration = defaults.configuration;
    this.sessionChangedEventCaller = _.debounce((session) => {
      this.dispatchEvent(new SessionChangedEvent(session, true));
    }, 1000);
  }

  set model(m) {
    this._model = m;
    this.dispatchEvent(new ModelSetEvent(this._model, true, !!this._model));
    this._render();
  }

  set session(s) {
    this._session = s;
    this._render();
  }

  set configuration(c) {
    this._configuration = c;
    this._render();
  }

  sessionChanged(s) {
    Object.keys(s).map(key => {
      this._session[key] = s[key];
    });

    this.sessionChangedEventCaller(this._session);
    log('session: ', this._session);
  }

  connectedCallback() {
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

    ReactDOM.render(el, this);
  }
}
