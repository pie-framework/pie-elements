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

const prepareCustomizationObject = (model) => {
  const defaultValues = {
    promptLabel : 'Prompt',
    responseTypeLabel: 'Response Type',
    choicesLabel: 'Choice Labels',
    addChoiceButtonLabel: 'Add a choice',
    enableSelectChoiceLabel: true,
    enableSelectResponseType: true,
    enableAddChoice: true,
    enableAddFeedBack: true,
    enableDeleteChoice: true
  };

  return {
    ...model,
    configure: defaults(model.configure, defaultValues)
  };
};

export default class extends HTMLElement {
  constructor() {
    super();
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = prepareCustomizationObject(utils.normalizeChoices(s));
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
      onModelChanged: this.onModelChanged,
      imageSupport: {
        add: this.insertImage.bind(this),
        delete: this.onDeleteImage.bind(this)
      }
    });
    ReactDOM.render(element, this);
  }
}
