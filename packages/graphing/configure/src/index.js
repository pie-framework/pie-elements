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
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';
import cloneDeep from 'lodash/cloneDeep';

const log = debug('pie-elements:graphing:configure');

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
    const {
      answers = {},
      domain = {},
      defaultTool,
      graph = {},
      range = {},
      standardGrid,
      toolbarTools,
    } = normalizedModel;

    // added support for models without defaultTool defined; also used in packages/graphing/controller/src/index.js
    const toolbarToolsNoLabel = (toolbarTools || []).filter((tool) => tool !== 'label');
    const normalizedDefaultTool = defaultTool || (toolbarToolsNoLabel.length && toolbarToolsNoLabel[0]) || '';

    return {
      ...normalizedModel,
      answers:
        (answers &&
          answers.correctAnswer && {
            correctAnswer: answers.correctAnswer,
            ...sortedAnswers(answers),
          }) ||
        answers,
      defaultTool: normalizedDefaultTool,
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

  set model(m) {
    this._model = GraphLinesConfigure.createDefaultModel(m);
    this._modelCopy = cloneDeep(this._model);

    this._render();
  }

  resetModelAfterConfigurationIsSet = () => {
    // In environments that use pie-player-components, model is set before configuration.
    // This is the reason why sometimes the model gets altered non-reversible
    // (altered using default configuration instead of client configuration, because at that point client configuration was not set yet)
    // Therefore, in such environments, we will make sure to keep a modelCopy (initialised in set model) and use it to reset
    // the model in set configuration (resetModelAfterConfigurationIsSet) if set configuration is ever called
    const pieAuthors = document.querySelectorAll('pie-author');
    this.hasPlayerAsParent = Array.from(pieAuthors).some(author => author.contains(this));

    if (this.hasPlayerAsParent) {
      if (this._modelCopy) {
        this._model = this._modelCopy;
      } else {
        delete this._modelCopy;
      }
    }
  }

  set configuration(c) {
    this._configuration = c;

    this.resetModelAfterConfigurationIsSet();

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

  onModelChanged = (model) => {
    this._model = model;
    this._render();

    log('[onModelChanged]: ', this._model);

    this.dispatchEvent(new ModelUpdatedEvent(this._model));
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

  insertSound(handler) {
    this.dispatchEvent(new InsertSoundEvent(handler));
  }

  onDeleteSound(src, done) {
    this.dispatchEvent(new DeleteSoundEvent(src, done));
  }

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
