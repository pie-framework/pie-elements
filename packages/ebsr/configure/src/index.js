import React from 'react';
import ReactDOM from 'react-dom';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';
import defaults from 'lodash/defaults';
import Main from './main';

import sensibleDefaults from './defaults';
import cloneDeep from 'lodash/cloneDeep';

const MODEL_UPDATED = ModelUpdatedEvent.TYPE;
const MC_TAG_NAME = 'ebsr-multiple-choice-configure';

class EbsrMCConfigure extends MultipleChoiceConfigure {
}

const defineMultipleChoice = () => {
  if (!customElements.get(MC_TAG_NAME)) {
    customElements.define(MC_TAG_NAME, EbsrMCConfigure);
  }
};

defineMultipleChoice();

const prepareCustomizationObject = (config, model) => {
  const configuration = defaults(config, sensibleDefaults.configuration);
  configuration.settingsPanelDisabled = true;

  return {
    configuration,
    model
  };
};

const { model: modelDefault } = sensibleDefaults || {};

export default class EbsrConfigure extends HTMLElement {
  static createDefaultModel = ({ partA = {}, partB = {}, ...model } = {}, defaults = modelDefault) => ({
    ...defaults,
    ...model,
    partA: {
      ...defaults.partA,
      ...partA,
      choicesLayout: partA.choicesLayout || (partA.verticalMode === false && 'horizontal') || defaults.partA.choicesLayout
    },
    partB: {
      ...defaults.partB,
      ...partB,
      choicesLayout: partB.choicesLayout || (partB.verticalMode === false && 'horizontal') || defaults.partB.choicesLayout
    },
  });

  constructor() {
    super();

    this._model = EbsrConfigure.createDefaultModel();

    this._configuration = sensibleDefaults.configuration;
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  set model(m) {
    console.log('***EBSR*** set model', cloneDeep(m));

    this._model = EbsrConfigure.createDefaultModel(m, this._model);

    this._render();
  }

  dispatchModelUpdated(reset) {
    const resetValue = !!reset;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, resetValue));
  }

  onModelChanged = (m, reset) => {
    console.log('***EBSR*** onModelChanged', { m: cloneDeep(m), model: this._model });

    this._model = EbsrConfigure.createDefaultModel(m, this._model);

    this.dispatchModelUpdated(reset);
    this._render();

  };

  set configuration(c) {
    const info = prepareCustomizationObject(c, this._model);
    this._configuration = info.configuration;

    this._render();
  }

  onConfigurationChanged(c) {
    this._configuration = prepareCustomizationObject(c, this._model).configuration;

    if (this._model) {
      this.onModelChanged(this._model);
    }

    this._render();
  }

  onModelUpdated = e => {

    if (e.target === this) {
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    const id = e.target && e.target.getAttribute('id');

    console.log('***EBSR*** onModelUpdated', { update: cloneDeep(e.update), model: this._model });

    if (id) {
      if (e.update) {
        this._model[`part${id}`] = e.update;
      }

      this.dispatchEvent(new ModelUpdatedEvent(this._model));
    }
  };

  connectedCallback() {
    this.addEventListener(MODEL_UPDATED, this.onModelUpdated);
    this._render();
  }

  disconnectedCallback() {
    this.removeEventListener(MODEL_UPDATED, this.onModelUpdated);
  }

  _render() {
    let element = React.createElement(Main, {
      model: this._model,
      configuration: this._configuration,
      onModelChanged: this.onModelChanged,
      onConfigurationChanged: this.onConfigurationChanged,
    });
    ReactDOM.render(element, this);
  }
}
