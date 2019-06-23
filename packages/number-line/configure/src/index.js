import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import defaults from './defaults';

export default class NumberLineConfigReactElement extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaults.model,
    ...model
  });

  constructor() {
    super();
    this._model = NumberLineConfigReactElement.createDefaultModel();
    this._configuration = defaults.configuration;
  }

  set model(s) {
    this._model = NumberLineConfigReactElement.createDefaultModel(s);
    this._rerender();
  }

  onChange = o => {
    this._model = { ...this._model, ...o };

    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));

    this._rerender();
  };

  _rerender() {
    let element = React.createElement(Main, {
      model: this._model,
      configuration: this._configuration,
      onChange: this.onChange
    });
    ReactDOM.render(element, this);
  }
}
