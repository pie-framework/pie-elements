import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import { ModelUpdatedEvent, InsertSoundEvent, DeleteSoundEvent } from '@pie-framework/pie-configure-events';
import * as defaults from './defaults';
import * as math from 'mathjs';
import cloneDeep from 'lodash/cloneDeep';

// this function is duplicated in controller; at some point, use the same shared function
const updateTicks = (model) => {
  const { graph: { domain, labelStep, ticks = {} } = {} } = model;
  const { minor, major } = ticks;

  if (domain) {
    domain.min = Number((domain.min || 0).toFixed(2));
    domain.max = Number((domain.max || 0).toFixed(2));
  }

  if (labelStep && typeof labelStep === 'string' && labelStep.match(/^[1-9][0-9]*\/[1-9][0-9]*$/g)) {
    model.graph.fraction = true;

    // update the ticks frequency and label value to match the label step if needed
    const step = math.evaluate(labelStep);

    if (step !== major) {
      ticks.major = step;
      ticks.minor = step / (major / minor);
    }
  }

  return model;
};

export default class NumberLine extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    const c = defaults.configuration;
    let language = model.language || '';

    if (!language && c.language && c.language.enabled) {
      if (c.languageChoices?.options?.length) {
        language = c.languageChoices.options[0].value;
      }
    }

    const normalizedModel = {
      ...defaults.model,
      ...model,
      language,
    };

    return updateTicks(normalizedModel);
  };

  constructor() {
    super();
    this._model = NumberLine.createDefaultModel();
    this._configuration = defaults.configuration;
  }

  set model(m) {
    this._model = NumberLine.createDefaultModel(m);
    this._modelCopy = cloneDeep(this._model);
    this._rerender();
  }

  set configuration(c) {
    const newConfiguration = {
      ...defaults.configuration,
      ...c,
    };

    this._configuration = newConfiguration;
    this._model = this._modelCopy;

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
      if (!this._configuration.languageChoices.options.find((option) => option.value === this._model.language)) {
        this._configuration.languageChoices.options.push({
          value: this._model.language,
          label: this._model.language,
        });
      }
    } else {
      delete this._model.language;
    }

    this._rerender();
  }

  onChange = (o) => {
    this._model = { ...this._model, ...o };

    this.dispatchEvent(new ModelUpdatedEvent(this._model));

    this._rerender();
  };

  insertSound(handler) {
    this.dispatchEvent(new InsertSoundEvent(handler));
  }

  onDeleteSound(src, done) {
    this.dispatchEvent(new DeleteSoundEvent(src, done));
  }

  _rerender() {
    let element = React.createElement(Main, {
      model: this._model,
      configuration: this._configuration,
      onChange: this.onChange,
      uploadSoundSupport: {
        add: this.insertSound.bind(this),
        delete: this.onDeleteSound.bind(this),
      },
    });

    ReactDOM.render(element, this);
  }
}
