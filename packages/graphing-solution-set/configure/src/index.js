import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
} from '@pie-framework/pie-configure-events';
import debug from 'debug';
import defaultValues from './defaults';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';

const log = debug('pie-elements:graphing-solution-set:configure');

// this function is implemented in controller as well
const sortedAnswers = (answers) =>
  Object.keys(answers || {})
    .sort()
    .reduce((result, key) => {
      if (key !== 'correctAnswer') {
        result[key] = answers[key];
      }

      return result;
    }, {});

export default class GraphLinesConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    const normalizedModel = { ...defaultValues.model, ...model };
    const { answers = {}, domain = {}, graph = {}, range = {}, standardGrid } = normalizedModel;
    return {
      ...normalizedModel,
      answers:
        (answers &&
          answers.correctAnswer && {
            correctAnswer: answers.correctAnswer,
            ...sortedAnswers(answers),
          }) ||
        answers,
      range:
        (standardGrid && {
          ...range,
          min: domain.min,
          max: domain.max,
          step: domain.step,
          labelStep: domain.labelStep,
        }) ||
        range,
      graph: (standardGrid && { ...graph, height: graph.width }) || graph,
    };
  };

  constructor() {
    super();
    this._model = GraphLinesConfigure.createDefaultModel();
    this._configuration = defaultValues.configuration;
  }

  /*
   * Function to set the model
   * */
  set model(m) {
    this._model = GraphLinesConfigure.createDefaultModel(m);
    this._render();
  }

  /*
   * Function to set the configuration
   * */
  set configuration(c) {
    this._configuration = c;
    // if language:enabled is true, then the corresponding default item model should include a language value;
    // if it is false, then the language field should be omitted from the item model.
    // if a default item model includes a language value (e.g., en_US) and the corresponding authoring view settings have language:settings = true,
    // then (a) language:enabled should also be true, and (b) that default language value should be represented in languageChoices[] (as a key).
    //TODO: add logic in controller and add tests
    if (c.language?.enabled) {
      if (c.languageChoices?.options?.length) {
        this._model.language = c.languageChoices.options[0].value;
      }
    } else {
      if (c.language.settings) {
        if (this._model.language) {
          this._configuration.language.enabled = true;
        }
      } else {
        delete this._model.language;
      }
    }
    this._render();
  }

  /*
   * Triggered when the model is changed
   * @param {object} model - the new model
   * */
  onModelChanged = (model) => {
    this._model = model;
    this._render();
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model));
  };

  /*
   * Triggered when the configuration is changed
   * @param {object} config - the new configuration
   * */
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

  insertSound(handler) {
    this.dispatchEvent(new InsertSoundEvent(handler));
  }

  onDeleteSound(src, done) {
    this.dispatchEvent(new DeleteSoundEvent(src, done));
  }

  /*
   * Render the component
   * */
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
        },
        uploadSoundSupport: {
          add: this.insertSound.bind(this),
          delete: this.onDeleteSound.bind(this),
        },
      });
      ReactDOM.render(el, this, () => {
        renderMath(this);
      });
    }
  }
}
