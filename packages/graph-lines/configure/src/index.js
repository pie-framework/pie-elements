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
    ...defaultValues.model,
    ...model,
    graph: defaults(defaultValues.graph, model.graph),
  });

  constructor() {
    super();
    this._model = GraphLinesConfigure.createDefaultModel();
    this._configuration = defaultValues.configuration;
  }

  set model(m) {
    this._model = GraphLinesConfigure.createDefaultModel(m);
    this._render();
  }

  set configuration(c) {
    this._configuration = c;
    this._render();
  }

  onModelChanged(model) {
    this._model = model;
    this._render();
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));
  }

  onConfigurationChanged(config) {
    this._configuration = config;
    this._render();
  }

  _render() {
    if (this._model) {
      const el = React.createElement(Configure, {
        onModelChanged: this.onModelChanged.bind(this),
        onConfigurationChanged: this.onConfigurationChanged.bind(this),
        model: this._model,
        configuration: this._configuration
      });
      ReactDOM.render(el, this);
    }
  }
}
