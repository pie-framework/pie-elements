import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '@pie-ui/point-intercept';
import debug from 'debug';
import * as mapper from './mapper';

const log = debug('pie-elements:point-intercept');

export default class PointIntercept extends HTMLElement {
  constructor() {
    super();
  }

  set model(m) {
    this._model = m;
    this._render();
  }

  set session(s) {
    this._session = s;
    this._render();
  }

  sessionChanged(s) {
    this._session.points = s.points;
    log('session: ', this._session);
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (!this._model || !this._session) {
      return;
    }

    const props = {
      model: mapper.toComponentModel(this._model),
      session: this._session,
      onSessionChange: this.sessionChanged.bind(this)
    };

    const el = React.createElement(Component, props);

    ReactDOM.render(el, this);
  }
}
