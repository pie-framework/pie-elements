import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

import Main from './main';
import defaults from './defaults';

const modelWithDefaults = (m) => ({ ...defaults.model, ...m });
const configurationWithDefaults = (c) => ({ ...defaults.configuration, ...c });

export default class RubricElement extends HTMLElement {
  constructor() {
    super();
    debug.log('constructor called');
    this._model = modelWithDefaults();
    this._configuration = configurationWithDefaults();
    this.onModelChanged = this.onModelChanged.bind(this);
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  set model(m) {
    this._model = modelWithDefaults(m);
    this._render();
  }

  set configuration(c) {
    this._configuration = configurationWithDefaults(c);
    this._render();
  }

  onModelChanged(m) {
    this._model = m;
    this._render();
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  onConfigurationChanged = (c) => {
    this._configuration = configurationWithDefaults(c);

    if (this._model) {
      this.onModelChanged(this._model);
    }

    this._render();
  };

  connectedCallback() {
    this._render();
  }

  _render() {
    if (this._model) {
      let element = React.createElement(Main, {
        model: this._model,
        configuration: this._configuration,
        onModelChanged: this.onModelChanged,
        onConfigurationChanged: this.onConfigurationChanged,
      });

      ReactDOM.render(element, this);
    }
  }
}
