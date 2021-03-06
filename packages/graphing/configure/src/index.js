import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import { DeleteImageEvent, InsertImageEvent, ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import debug from 'debug';

import defaultValues from './defaults';

const log = debug('pie-elements:graphing:configure');
import isEmpty from 'lodash/isEmpty';

// this function is implemented in controller as well
const sortedAnswers = (answers) => {
  answers = answers || {};

  return Object.keys(answers).sort().reduce((result, key) => {
    result[key] = answers[key];

    return result;
  }, {});
};

export default class GraphLinesConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    
    if (!isEmpty(model.answers) && model.answers.hasOwnProperty('correctAnswer')) {
        model.answers = Object.assign({ correctAnswer: model.answers.correctAnswer }, sortedAnswers(model.answers));
    }

    return { ...defaultValues.model, ...model }
  };

  constructor() {
    super();
    this._model = GraphLinesConfigure.createDefaultModel();
    this._configuration = defaultValues.configuration;
  }

  set model(m) {
    this._model = GraphLinesConfigure.createDefaultModel(m);
    this._render();
  }

  set configuration(c) {
    this._configuration = c;
    this._render();
  }

  onModelChanged = (model) => {
    this._model = model;
    this._render();

    log('[onModelChanged]: ', this._model);

    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));
  };

  onConfigurationChanged = (config) => {
    this._configuration = config;
    this._render();
  };

  insertImage = (handler) => {
    this.dispatchEvent(new InsertImageEvent(handler));
  };

  onDeleteImage = (src, done) => {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  };

  _render() {
    if (this._model) {
      const el = React.createElement(Configure, {
        onModelChanged: this.onModelChanged,
        onConfigurationChanged: this.onConfigurationChanged,
        model: this._model,
        configuration: this._configuration,
        imageSupport: {
          add: this.insertImage,
          delete: this.onDeleteImage,
        }
      });
      ReactDOM.render(el, this);
    }
  }
}
