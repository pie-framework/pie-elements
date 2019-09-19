import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import {
  DeleteImageEvent,
  InsertImageEvent,
  ModelUpdatedEvent
} from '@pie-framework/pie-configure-events';

import Main from './main';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import defaults from 'lodash/defaults';

import sensibleDefaults from './defaults';

const log = debug('multiple-choice:configure');

const generateFormattedChoices = (choices, choiceCount = 0) => {
  if (!choices || choices.length === 0) {
    let formattedChoices = [];

    for (let i = 0; i < choiceCount; i++) {
      formattedChoices.push({
        value: `${i}`,
        label: '',
        feedback: {
          type: 'none',
          value: ''
        }
      });
    }

    return formattedChoices;
  }

  return choices;
};

const prepareCustomizationObject = (config, model) => {
  const configuration = defaults(config, sensibleDefaults.configuration);

  return {
    configuration,
    model: {
      ...model,
      choices: generateFormattedChoices((model && model.choices) || [], configuration && configuration.answerChoiceCount)
    }
  };
};

export default class MultipleChoice extends HTMLElement {
  static createDefaultModel = (model = {}) => utils.normalizeChoices({
    ...sensibleDefaults.model,
    ...model,
    choices: generateFormattedChoices((model && model.choices) || []),
    allowFeedback: sensibleDefaults.configuration.feedback.enabled
  });

  constructor() {
    super();
    this._model = MultipleChoice.createDefaultModel();
    this._configuration = sensibleDefaults.configuration;
    this.onModelChanged = this.onModelChanged.bind(this);
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  set model(s) {
    this._model = MultipleChoice.createDefaultModel(s);

    this._render();
  }

  set configuration(c) {
    const info = prepareCustomizationObject(c, this._model);

    this.onModelChanged(info.model);
    this._configuration = info.configuration;
    this._render();
  }

  set disableSidePanel(s) {
    this._disableSidePanel = s;
    this._render();
  }

  dispatchModelUpdated(reset) {
    const resetValue = !!reset;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, resetValue));
  }

  onModelChanged(m, reset) {
    this._model = m;
    this._render();
    this.dispatchModelUpdated(reset);
  }

  onConfigurationChanged(c) {
    this._configuration = prepareCustomizationObject(c, this._model).configuration;

    if (this._model) {
      this._model.allowFeedback = (c.feedback || {}).enabled;

      this.onModelChanged(this._model);
    }

    this._render();
  }

  /** @param {done, progress, file} handler */
  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  _render() {
    log('_render');
    let element = React.createElement(Main, {
      model: this._model,
      configuration: this._configuration,
      onModelChanged: this.onModelChanged,
      onConfigurationChanged: this.onConfigurationChanged,
      disableSidePanel: this._disableSidePanel,
      imageSupport: {
        add: this.insertImage.bind(this),
        delete: this.onDeleteImage.bind(this)
      }
    });
    ReactDOM.render(element, this);
  }
}
