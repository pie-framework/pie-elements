import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import debug from 'debug';

import defaultValues from './defaults';
import defaults from 'lodash/defaults';

const log = debug('pie-elements:graph-lines:configure');

export default class GraphLinesConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaultValues,
    ...model,
    configure: defaults(defaultValues.configure, model.configure),
    graph: defaults(defaultValues.graph, model.graph),
  });

  constructor() {
    super();
    this._model = GraphLinesConfigure.createDefaultModel();
  }

  set model(m) {
    this._model = GraphLinesConfigure.createDefaultModel(m);
    this._render();
  }

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));
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
