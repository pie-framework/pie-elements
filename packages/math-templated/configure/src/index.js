import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import defaults from 'lodash/defaults';
import isArray from 'lodash/isArray';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
} from '@pie-framework/pie-configure-events';

import Main from './design';

import sensibleDefaults from './defaults';
import { processMarkup, createSlateMarkup } from './markupUtils';

const log = debug('math-templated:configure');

export default class MathTemplateConfigure extends HTMLElement {
  static prepareModel = (model = {}) => {
    const { validationDefault, allowTrailingZerosDefault, ignoreOrderDefault, responses = {} } = model;

    const updatedResponses = Object.keys(responses).reduce((acc, responseId) => {
      const correctResponse = responses[responseId];

      acc[responseId] = {
        ...correctResponse,
        validation: correctResponse.validation || validationDefault,
        allowTrailingZeros: correctResponse.allowTrailingZeros || allowTrailingZerosDefault,
        ignoreOrder: correctResponse.ignoreOrder || ignoreOrderDefault,
      };

      return acc;
    }, {});

    const joinedObj = {
      ...sensibleDefaults.model,
      ...model,
      responses: updatedResponses
    };

    const slateMarkup = joinedObj.slateMarkup || createSlateMarkup(joinedObj.markup, joinedObj.responses);
    const processedMarkup = processMarkup(slateMarkup);

    // this was added to treat an exception, when the model has responses without the "answer" property
    if (joinedObj.responses) {
      Object.keys(joinedObj.responses).forEach((key) => {
        if (isArray(joinedObj.responses[key])) {
          joinedObj.responses[key] = (joinedObj.responses[key] || []).map((item, index) => {
            if (!item.answer) {
              log('Choice does not contain "answer" property, which is required.', item);
              return { answer: `${index}`, ...item };
            }

            return item;
          });
        }
      });
    }

    return {
      ...joinedObj,
      slateMarkup,
      markup: processedMarkup,
    };
  };

  constructor() {
    super();
    this._model = MathTemplateConfigure.prepareModel();
    this._configuration = sensibleDefaults.configuration;
    this.onModelChanged = this.onModelChanged.bind(this);
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  set model(s) {
    this._model = MathTemplateConfigure.prepareModel(s);
    this._render();
  }

  set configuration(c) {
    this._configuration = defaults(c, sensibleDefaults.configuration);

    // if language:enabled is true, then the corresponding default item model should include a language value;
    // if it is false, then the language field should be omitted from the item model.
    // if a default item model includes a language value (e.g., en_US) and the corresponding authoring view settings have language:settings = true,
    // then (a) language:enabled should also be true, and (b) that default language value should be represented in languageChoices[] (as a key).
    if (c.language?.enabled) {
      if (c.languageChoices?.options?.length) {
        this._model.language = c.languageChoices.options[0].value;
      }
    } else if (c.language.settings && this._model.language) {
      this._configuration.language.enabled = true;

      if (!this._configuration.languageChoices.options || !this._configuration.languageChoices.options.length) {
        this._configuration.languageChoices.options = [];
      }

      // check if the language is already included in the languageChoices.options array
      // and if not, then add it.
      if (!this._configuration.languageChoices.options.find(option => option.value === this._model.language)) {
        this._configuration.languageChoices.options.push({
          value: this._model.language,
          label: this._model.language,
        });
      }
    } else {
      delete this._model.language;
    }

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
    this._model = MathTemplateConfigure.prepareModel(m);
    this._render();
    this.dispatchModelUpdated(reset);
  }

  onConfigurationChanged(c) {
    this._configuration = c;
    this._render();
  }

  /** @param {done, progress, file} handler */
  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  insertSound(handler) {
    this.dispatchEvent(new InsertSoundEvent(handler));
  }

  onDeleteSound(src, done) {
    this.dispatchEvent(new DeleteSoundEvent(src, done));
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
        delete: this.onDeleteImage.bind(this),
      },
      uploadSoundSupport: {
        add: this.insertSound.bind(this),
        delete: this.onDeleteSound.bind(this),
      },
    });

    ReactDOM.render(element, this);
  }
}
