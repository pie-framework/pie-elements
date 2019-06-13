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

  onDomainChanged(domain) {
    this._model.graph.domain = domain;
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onTickFrequencyChange(event, value) {
    this._model.graph.tickFrequency = parseInt(value, 10);
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onMinorTicksChanged(event, value) {
    this._model.graph.showMinorTicks = value;
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onSnapPerTickChange(event, value) {
    this._model.graph.snapPerTick = parseInt(value, 10);
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onConfigChange(graph) {
    this._model.graph = graph;
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onCorrectResponseChange(correctResponse) {
    this._model.correctResponse = correctResponse;
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onInitialElementsChange(initialElements) {
    this._model.graph.initialElements = initialElements;
    let detail = {
      update: this._model,
      reset: true
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onAvailableTypesChange(availableTypes) {
    this._model.graph.availableTypes = availableTypes;
    let detail = {
      update: this._model,
      reset: true
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onFeedbackChange(feedback) {
    this._model.feedback = feedback;
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onPromptChanged = prompt => {
    this._model.prompt = prompt;
    let detail = {
      update: this._model
    };

    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );

    this._rerender();
  };

  onChange = o => {
    console.log('onChange: ', o);
    this._model = { ...this._model, ...o };

    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));

    this._rerender();
  };
  _rerender() {
    let element = React.createElement(Main, {
      model: this._model,
      configuration: this._configuration,
      onChange: this.onChange,
      onDomainChange: this.onDomainChanged.bind(this),
      onMinorTicksChanged: this.onMinorTicksChanged.bind(this),
      onTickFrequencyChange: this.onTickFrequencyChange.bind(this),
      onSnapPerTickChange: this.onSnapPerTickChange.bind(this),
      onConfigChange: this.onConfigChange.bind(this),
      onCorrectResponseChange: this.onCorrectResponseChange.bind(this),
      onInitialElementsChange: this.onInitialElementsChange.bind(this),
      onAvailableTypesChange: this.onAvailableTypesChange.bind(this),
      onFeedbackChange: this.onFeedbackChange.bind(this),
      onPromptChanged: this.onPromptChanged.bind(this)
    });
    ReactDOM.render(element, this);
  }
}
