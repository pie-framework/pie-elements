import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import debug from 'debug';

const log = debug('pie-elements:text-entry:configure');

export default class TextEntryConfigure extends HTMLElement {
  static prepareModelObject = (model = {}) => {
    const sensibleDefaults = {
      correctResponses: {
        values: ['mutt', 'hound'],
        ignoreWhitespace: true,
        ignoreCase: false
      },
      partialResponses: {
        values: ['mutty'],
        ignoreWhitespace: true,
        ignoreCase: true,
        awardPercentage: '50'
      },
      answerBlankSize: '10',
      answerAlignment: 'left',
      prompt: 'Question Prompt goes here',
      allowDecimal: true,
      allowThousandsSeparator: true
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
    this._model = TextEntryConfigure.prepareModelObject(m);
    this._render();
  }

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model));
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
