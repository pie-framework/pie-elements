import React from 'react';
import ReactDOM from 'react-dom';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';
import defaults from 'lodash/defaults';
import Main from './main';

import sensibleDefaults from './defaults';

const MODEL_UPDATED = ModelUpdatedEvent.TYPE;
const MC_TAG_NAME = 'ebsr-multiple-choice-configure';

class EbsrMCConfigure extends MultipleChoiceConfigure {}
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
    model,
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
      choicesLayout:
        partA.choicesLayout || (partA.verticalMode === false && 'horizontal') || defaults.partA.choicesLayout,
    },
    partB: {
      ...defaults.partB,
      ...partB,
      choicesLayout:
        partB.choicesLayout || (partB.verticalMode === false && 'horizontal') || defaults.partB.choicesLayout,
    },
  });

  constructor() {
    super();

    this._model = EbsrConfigure.createDefaultModel();

    this._configuration = sensibleDefaults.configuration;
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  set model(m) {
    this._model = EbsrConfigure.createDefaultModel(m, this._model);

    this._render();
  }

  dispatchModelUpdated(reset) {
    const resetValue = !!reset;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, resetValue));
  }

  onModelChanged = (m, reset) => {
    this._model = EbsrConfigure.createDefaultModel(m, this._model);

    this.dispatchModelUpdated(reset);
    this._render();
  };

  set configuration(c) {
    const info = prepareCustomizationObject(c, this._model);

    const newConfiguration = {
      ...sensibleDefaults.configuration,
      ...info.configuration,
    };

    this._configuration = newConfiguration;

    // if language:enabled is true, then the corresponding default item model should include a language value;
    // if it is false, then the language field should be omitted from the item model.
    // if a default item model includes a language value (e.g., en_US) and the corresponding authoring view settings have language:settings = true,
    // then (a) language:enabled should also be true, and (b) that default language value should be represented in languageChoices[] (as a key).
    if (newConfiguration?.language?.enabled) {
      if (newConfiguration?.languageChoices?.options?.length) {
        this._model.language = newConfiguration?.languageChoices.options[0].value;
      }
    } else if (newConfiguration.language.settings && this._model.language) {
      this._configuration.language.enabled = true;

      if (!this._configuration.languageChoices.options || !this._configuration.languageChoices.options.length) {
        this._configuration.languageChoices.options = [];
      }

      // check if the language is already included in the languageChoices.options array
      // and if not, then add it.
      if (!this._configuration.languageChoices.options.find(option => option.value === this._model.language)) {
        this._configuration.languageChoices.options.push({
          value: this._model.language,
          label: this._model.language,
        });
      }
    } else {
      delete this._model.language;
    }

    this._render();
  }

  onConfigurationChanged(c) {
    this._configuration = prepareCustomizationObject(c, this._model).configuration;

    if (this._model) {
      this.onModelChanged(this._model);
    }

    this._render();
  }

  onModelUpdated = (e) => {
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
