import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import {
  DeleteImageEvent,
  InsertImageEvent,
  ModelUpdatedEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
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
          value: '',
        },
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
      choices: generateFormattedChoices(
        (model && model.choices) || [],
        configuration && configuration.answerChoiceCount,
      ),
    },
  };
};

export default class MultipleChoice extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    const normalizedModel = utils.normalizeChoices({
      ...sensibleDefaults.model,
      ...model,
      choices: generateFormattedChoices((model && model.choices) || []),
    });

    // This is used for offering support for old models which have the property "verticalMode"
    normalizedModel.choicesLayout =
      model.choicesLayout || (model.verticalMode === false && 'horizontal') || sensibleDefaults.model.choicesLayout;

    return normalizedModel;
  };

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

    const newConfiguration = {
      ...sensibleDefaults.configuration,
      ...info.configuration,
    };
    this._configuration = newConfiguration;

    // if language:enabled is true, then the corresponding default item model should include a language value;
    // if it is false, then the language field should be omitted from the item model.
    // if a default item model includes a language value (e.g., en_US) and the corresponding authoring view settings have language:settings = true,
    // then (a) language:enabled should also be true, and (b) that default language value should be represented in languageChoices[] (as a key).
    if (newConfiguration?.language?.enabled) {
      if (newConfiguration?.languageChoices?.options?.length) {
        this._model.language = newConfiguration?.languageChoices.options[0].value;
      }
    } else if (newConfiguration.language.settings && this._model.language) {
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
    this._model = m;
    this._render();

    this.dispatchModelUpdated(reset);
  }

  onConfigurationChanged(c) {
    this._configuration = prepareCustomizationObject(c, this._model).configuration;

    if (this._model) {
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
