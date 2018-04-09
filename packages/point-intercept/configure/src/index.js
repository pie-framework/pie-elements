import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import {ModelUpdatedEvent} from '@pie-framework/pie-configure-events';
import debug from 'debug';
import { formatToNewModel, formatToOldModel } from './model-mapper';

const log = debug('pie-elements:function-entry:configure');

export default class FunctionEntryConfigure extends HTMLElement {

  constructor() {
    super();
  }

  set model(m) {
    this._model = formatToNewModel(m);
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

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(formatToOldModel(this._model)));
  }

  _render() {
    if (this._model) {
      const el = React.createElement(Configure, {
        onModelChanged: this.onModelChanged.bind(this),
        onSessionChange: this.sessionChanged.bind(this),
        session: this._session,
        model: this._model
      });
      ReactDOM.render(el, this);
    }
  }
}
