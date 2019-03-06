import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import debug from 'debug';

const log = debug('pie-elements:math-inline:configure');

export default class MathInlineConfigure extends HTMLElement {
  static prepareModelObject = (model = {}) => {
    const sensibleDefaults = {
      mode: 'advanced',
      expression: 'y = ',
      question: 'What is the equation for a slope?',
      equationEditor: 'everything',
      defaultResponse: {
        id: 0,
        validation: 'symbolic',
        answer: 'mx + b',
        alternates: {},
        allowSpaces: true,
        allowDecimals: true
      },
      responses: [{
        id: 'answerBlock1',
        validation: 'symbolic',
        answer: 'mx + b',
        alternates: {},
        allowSpaces: true,
        allowDecimals: true
      }],
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
    this._model = MathInlineConfigure.prepareModelObject(m);
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
