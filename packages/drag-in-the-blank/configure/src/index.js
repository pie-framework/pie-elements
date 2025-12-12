import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
} from '@pie-framework/pie-configure-events';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { renderMath } from '@pie-lib/math-rendering';
import Main from './main';
import debug from 'debug';
import defaults from 'lodash/defaults';

import sensibleDefaults from './defaults';
import { processMarkup, createSlateMarkup } from './markupUtils';

const log = debug('multiple-choice:configure');

export default class DragInTheBlank extends HTMLElement {
  static prepareModel = (model = {}) => {
    const joinedObj = {
      ...sensibleDefaults.model,
      ...model,
    };
    const slateMarkup =
      model.slateMarkup || createSlateMarkup(joinedObj.markup, joinedObj.choices, joinedObj.correctResponse);
    const processedMarkup = processMarkup(slateMarkup);

    return {
      ...joinedObj,
      slateMarkup,
      markup: processedMarkup.markup,
      correctResponse: processedMarkup.correctResponse,
    };
  };

  constructor() {
    super();
    this._root = null;
    this._model = DragInTheBlank.prepareModel();
    this._configuration = sensibleDefaults.configuration;
    this.onModelChanged = this.onModelChanged.bind(this);
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  set model(m) {
    const formModel = {
      ...m,
      markup: `<div>${m.markup || sensibleDefaults.model.markup}</div>`,
    };

    this._model = DragInTheBlank.prepareModel(formModel);
    this._render();
  }

  set configuration(c) {
    const newConfiguration = defaults(c, sensibleDefaults.configuration);

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
    this._model = DragInTheBlank.prepareModel(m);
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

    if (!this._root) {
      this._root = createRoot(this);
    }
    this._root.render(element);

    // Use triple requestAnimationFrame to defer renderMath after Slate finishes rendering
    // This allows speech-rule-engine to initialize and Slate to complete its render cycle
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          renderMath(this);
        });
      });
    });
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
