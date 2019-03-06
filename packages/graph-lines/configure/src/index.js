import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import debug from 'debug';

const log = debug('pie-elements:graph-lines:configure');

export default class GraphLinesConfigure extends HTMLElement {
  static prepareModelObject = (model = {}) => {
    const sensibleDefaults = {
      model: {
        config: {
          lines: [{
            label: 'Line One',
            correctLine: '3x+2',
            initialView: '3x+3'
          }],
          domainMin: -10,
          domainMax: 10,
          domainStepValue: 1,
          domainSnapValue: 1,
          domainLabelFrequency: 1,
          domainGraphPadding: 50,
          rangeMin: -10,
          rangeMax: 10,
          rangeStepValue: 1,
          rangeSnapValue: 1,
          rangeLabelFrequency: 1,
          rangeGraphPadding: 50,
          showPointLabels: true,
          showInputs: true,
          showAxisLabels: true,
          showFeedback: true
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

  set model(m) {
    this._model = GraphLinesConfigure.prepareModelObject(m);
    this._render();
  }

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));
  }

  _render() {
    if (this._model) {
      const el = React.createElement(Configure, {
        onModelChanged: this.onModelChanged.bind(this),
        model: this._model
      });
      ReactDOM.render(el, this);
    }
  }
}
