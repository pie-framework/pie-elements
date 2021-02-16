import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';

import Main from './main';
import defaults from './defaults';

const modelWithDefaults = m => ({ ...defaults.model, ...m });
const configurationWithDefaults = c => ({ ...defaults.configuration, ...c });

export default class MultiTraitRubricElement extends HTMLElement {
  constructor() {
    super();
    this._model = modelWithDefaults();
    this._configuration = configurationWithDefaults();
  }

  set model(m) {
    this._model = modelWithDefaults(m);
    this._render();
  }


  set configuration(c) {
    this._configuration = configurationWithDefaults(c);
    this._render();
  }

  onModelChanged = (m) => {
    this._model = modelWithDefaults(m);
    this._render();
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  onConfigurationChanged = (c) => {
    this._configuration = configurationWithDefaults(c);

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
