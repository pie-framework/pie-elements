import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import * as defaults from './defaults';
import * as math from "mathjs";

// this function is duplicated in controller; at some point, use the same shared function
const updateTicks = model => {
  const { graph: { labelStep, ticks = {}} = {}} = model;
  const { minor, major } = ticks;

  if (labelStep && typeof labelStep === 'string' && labelStep.match(/^[1-9][0-9]*\/[1-9][0-9]*$/g)) {
    model.graph.fraction = true;

    // update the ticks frequency and label value to match the label step if needed
    const step = math.evaluate(labelStep);

    if (step !== major) {
      ticks.major = step;
      ticks.minor = step / (major / minor);
    }
  };

  return model;
};

export default class NumberLine extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    const normalizedModel = {
      ...defaults.model,
      ...model
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
