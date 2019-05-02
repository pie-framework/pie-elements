import {
  DeleteImageEvent,
  InsertImageEvent,
  ModelUpdatedEvent
} from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import debug from 'debug';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import defaults from 'lodash/defaults';

import sensibleDefaults from './defaults';

const log = debug('multiple-choice:configure');

const generateFormattedChoices = (choices, choiceCount = 4) => {
  if (!choices || choices.length === 0) {
    let formattedChoices = [];

    for (let i = 0; i < choiceCount; i++) {
      formattedChoices.push({
        value: '',
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
  const configure = defaults(config, sensibleDefaults.configure);

  return {
    configure,
    model: {
      ...model,
      choices: generateFormattedChoices(model.choices, configure.answerChoiceCount)
    }
  };
};

export default class MultipleChoice extends HTMLElement {
  static createDefaultModel = (model = {}) => utils.normalizeChoices({
    choices: generateFormattedChoices(model.choices),
    ...sensibleDefaults,
    ...model,
  });

  constructor() {
    super();
    this._model = MultipleChoice.createDefaultModel();
    this._configure = sensibleDefaults.configure;
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = MultipleChoice.createDefaultModel(s);
    this._render();
  }

  set configure(c) {
    const info = prepareCustomizationObject(c, this._model);

    this.onModelChanged(info.model);
    this._configure = info.configure;
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
    this.dispatchModelUpdated(reset);
  }

  /**
   *
   * @param {done, progress, file} handler
   */
  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  _render() {
    log('_render');
    let element = React.createElement(Root, {
      model: this._model,
      configure: this._configure,
      disableSidePanel: this._disableSidePanel,
      onModelChanged: this.onModelChanged,
      imageSupport: {
        add: this.insertImage.bind(this),
        delete: this.onDeleteImage.bind(this)
      }
    });
    ReactDOM.render(element, this);
  }
}
