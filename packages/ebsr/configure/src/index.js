import React from 'react';
import ReactDOM from 'react-dom';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';
import defaults from 'lodash/defaults';
import Main from './main';

import sensibleDefaults from './defaults';

const MODEL_UPDATED = ModelUpdatedEvent.TYPE;
const MC_TAG_NAME = 'ebsr-multiple-choice-configure';

class EbsrMCConfigure extends MultipleChoiceConfigure { }

const defineMultipleChoice = () => {
  if (!customElements.get(MC_TAG_NAME)) {
    customElements.define(MC_TAG_NAME, EbsrMCConfigure);
  }
};

defineMultipleChoice();

const prepareCustomizationObject = (config, model) => {
  const configuration = defaults(config, sensibleDefaults.configuration);
  configuration.settingsPanelDisabled = true;
  // it is required for ebsr partA not to allow changing response type
  configuration.partA.choiceMode = {
    settings: false,
    label: 'Response Type'
  };

  return {
    configuration,
    model
  };
};

export default class EbsrConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...sensibleDefaults.model,
    ...model,
    partA: {
      ...sensibleDefaults.model.partA,
      ...model.partA
    },
    partB: {
      ...sensibleDefaults.model.partB,
      ...model.partB
    },
  });

  constructor() {
    super();

    this._model = EbsrConfigure.createDefaultModel();
    this._configuration = sensibleDefaults.configuration;
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  set model(m) {
    this._model = {
      ...this._model,
      ...m,
      partA: {
        ...this._model.partA,
        ...m.partA,
      },
      partB: {
        ...this._model.partB,
        ...m.partB,
      }
    };

    this._render();
  }

  dispatchModelUpdated(reset) {
    const resetValue = !!reset;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, resetValue));
  }

  onModelChanged = (m, reset) => {
    this._model = {
      ...this._model,
      ...m,
      partA: {
        ...this._model.partA,
        ...m.partA,
      },
      partB: {
        ...this._model.partB,
        ...m.partB,
      }
    };

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
