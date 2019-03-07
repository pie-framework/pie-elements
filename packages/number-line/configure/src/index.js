import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';

export default class NumberLineConfigReactElement extends HTMLElement {
  static prepareModelObject = (model = {}) => {
    const sensibleDefaults = {
      correctResponse: [
        {
          type: 'point',
          pointType: 'full',
          domainPosition: 1
        },
        {
          type: 'line',
          leftPoint: 'full',
          rightPoint: 'empty',
          domainPosition: 1,
          size: 2
        }
      ],
      config: {
        domain: [-5, 5],
        initialElements: [
          {
            type: 'point',
            pointType: 'empty',
            domainPosition: -1
          }
        ],
        maxNumberOfPoints: 20,
        tickFrequency: 6,
        showMinorTicks: true,
        snapPerTick: 1,
        initialType: 'PF',
        availableTypes: {
          PF: true,
          PE: true,
          LFF: true,
          LEF: true,
          LFE: true,
          LEE: true,
          RFN: true,
          RFP: true,
          REN: true,
          REP: true
        }
      }
    };

    return {
      ...sensibleDefaults,
      ...model,
    };
  };

  constructor() {
    super();
  }

  set model(s) {
    this._model = NumberLineConfigReactElement.prepareModelObject(s);
    this._rerender();
  }

  onDomainChanged(domain) {
    this._model.config.domain = domain;
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onTickFrequencyChange(event, value) {
    this._model.config.tickFrequency = parseInt(value, 10);
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onMinorTicksChanged(event, value) {
    this._model.config.showMinorTicks = value;
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onSnapPerTickChange(event, value) {
    this._model.config.snapPerTick = parseInt(value, 10);
    let detail = {
      update: this._model
    };
    this.dispatchEvent(
      new CustomEvent('model.updated', { bubbles: true, detail })
    );
    this._rerender();
  }

  onConfigChange(config) {
    this._model.config = config;
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
    this._model.config.initialElements = initialElements;
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
    this._model.config.availableTypes = availableTypes;
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

  _rerender() {
    let element = React.createElement(Main, {
      model: this._model,
      onDomainChange: this.onDomainChanged.bind(this),
      onMinorTicksChanged: this.onMinorTicksChanged.bind(this),
      onTickFrequencyChange: this.onTickFrequencyChange.bind(this),
      onSnapPerTickChange: this.onSnapPerTickChange.bind(this),
      onConfigChange: this.onConfigChange.bind(this),
      onCorrectResponseChange: this.onCorrectResponseChange.bind(this),
      onInitialElementsChange: this.onInitialElementsChange.bind(this),
      onAvailableTypesChange: this.onAvailableTypesChange.bind(this),
      onFeedbackChange: this.onFeedbackChange.bind(this)
    });
    ReactDOM.render(element, this);
  }
}
