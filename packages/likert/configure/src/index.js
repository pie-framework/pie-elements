import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import {ModelUpdatedEvent} from '@pie-framework/pie-configure-events';

import Main from './main';
import defaults from 'lodash/defaults';

import sensibleDefaults from './defaults';

const log = debug('likert:configure');

const prepareCustomizationObject = (config, model) => {
  const configuration = defaults(config, sensibleDefaults.configuration);

  return {
    configuration,
    model
  };
};

export default class Likert extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...sensibleDefaults.model,
    ...model,
    choices: model && model.choices || []
  });

  constructor() {
    super();
    this._model = Likert.createDefaultModel();
    this._configuration = sensibleDefaults.configuration;
    this.onModelChanged = this.onModelChanged.bind(this);
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  set model(s) {
    this._model = Likert.createDefaultModel(s);
    this._model = {
      ...this._model,
      choices: this._model.choices.map(choice => ({ ...choice, value: parseInt(choice.value) }))
    };
    this._render();
  }

  set configuration(c) {
    const info = prepareCustomizationObject(c, this._model);

    this.onModelChanged(info.model);
    this._configuration = info.configuration;
    this._render();
  }

  set disableSidePanel(s) {
    this._disableSidePanel = s;
    this._render();
  }

  dispatchModelUpdated(reset) {
    const resetValue = !!reset;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, resetValue));
  }

  onModelChanged(m, reset) {
    this._model = m;
    this._render();
    this.dispatchModelUpdated(reset);
  }

  onConfigurationChanged(c) {
    this._configuration = prepareCustomizationObject(c, this._model).configuration;

    if (this._model) {
      this.onModelChanged(this._model);
    }

    this._render();
  }

  _render() {
    log('_render');
    let element = React.createElement(Main, {
      model: this._model,
      configuration: this._configuration,
      onModelChanged: this.onModelChanged,
      onConfigurationChanged: this.onConfigurationChanged,
      disableSidePanel: this._disableSidePanel
    });
    ReactDOM.render(element, this);
  }
}
