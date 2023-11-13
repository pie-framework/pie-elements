import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import { ModelUpdatedEvent, InsertSoundEvent, DeleteSoundEvent } from '@pie-framework/pie-configure-events';
import * as defaults from './defaults';
import * as math from 'mathjs';

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

  set model(s) {
    this._model = NumberLine.createDefaultModel(s);
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
