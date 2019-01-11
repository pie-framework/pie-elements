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

const log = debug('multiple-choice:configure');

const defaultValues = {
  promptLabel : 'Prompt',
  responseTypeLabel: 'Response Type',
  choicesLabel: 'Choice Labels',
  addChoiceButtonLabel: 'Add a choice',
  addChoices: true,
  enableSelectChoiceMode: true,
  enableSelectChoiceLabels: true,
  enableAddFeedBack: true,
  enableDeleteChoice: true,
  enablePartialScoring: true,
  enableConfigShuffle: true,
  enableShowPrompt: true
};

const prepareCustomizationObject = (configure, model) => {
  const answerChoiceCount = configure.answerChoiceCount
    ? configure.answerChoiceCount
    : 4;
  let formattedChoices = model.choices;

  if (!formattedChoices || formattedChoices.length === 0) {
    formattedChoices = [];

    for (let i = 0; i < answerChoiceCount; i++) {
      formattedChoices.push({
        value: '',
        label: '',
        feedback: {
          type: 'none',
          value: ''
        }
      });
    }
  }

  return {
    model: {
      ...model,
      choices: formattedChoices
    },
    configure: defaults(configure, defaultValues)
  };
};

export default class extends HTMLElement {
  constructor() {
    super();
    this.onModelChanged = this.onModelChanged.bind(this);
    this._configure = defaultValues;
  }

  set model(s) {
    this._model = utils.normalizeChoices(s);
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
