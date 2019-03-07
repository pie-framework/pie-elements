import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import debug from 'debug';

import defaults from './defaults';

const log = debug('pie-elements:function-entry:configure');

export default class FunctionEntryConfigure extends HTMLElement {
  static prepareModelObject = (model = {}) => ({
    ...defaults,
    ...model,
  });

  constructor() {
    super();
  }

  set model(m) {
    this._model = FunctionEntryConfigure.prepareModelObject(m);
    this._render();
  }

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model));
  }

  _render() {
    if (this._model) {
      const el = React.createElement(Configure, {
        onModelChanged: this.onModelChanged.bind(this),
        model: this._model
      });
      ReactDOM.render(el, this);
    }
  }
}
