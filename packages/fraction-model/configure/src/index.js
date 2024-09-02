import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
} from '@pie-framework/pie-configure-events';
import defaultValues from './defaults';
import debug from 'debug';

export default class FractionModelConfigure extends HTMLElement {
  /**
   * This function makes sure you set the default values on the model
   * @param model
   * @returns model
   */
  static createDefaultModel = (model = {}) => {
    const c = defaultValues.configuration;
    let language = model.language || '';

    if (!language && c.language && c.language.enabled) {
      if (c.languageChoices?.options?.length) {
        language = c.languageChoices.options[0].value;
      }
    }

    const normalizedModel = {
      ...defaultValues.model,
      ...model,
      language,
    };

    return normalizedModel;
  };

  constructor() {
    super();
    this._model = FractionModelConfigure.createDefaultModel();
    this._configuration = defaultValues.configuration;
  }

  set model(m) {
    this._model = FractionModelConfigure.createDefaultModel(m);
    this.render();
  }

  set configuration(c) {
    const newConfiguration = {
      ...defaultValues.configuration,
      ...c,
    };
    this._configuration = newConfiguration;

    this.resetModelAfterConfigurationIsSet();

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
      if (!this._configuration.languageChoices.options.find((option) => option.value === this._model.language)) {
        this._configuration.languageChoices.options.push({
          value: this._model.language,
          label: this._model.language,
        });
      }
    } else {
      delete this._model.language;
    }
    this.render();
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

  connectedCallback() {
    this.render();
  }

  modelChanged(m) {
    this._model = m;
    this.dispatchEvent(new ModelUpdatedEvent(this._model), true);
    this.render();
  }

  onChange = (o) => {
    this._model = { ...this._model, ...o };
    this.dispatchEvent(new ModelUpdatedEvent(this._model));
    this.render();
  };

  onConfigurationChanged(c) {
    this._configuration = c;
    this.render();
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

  insertSound(handler) {
    this.dispatchEvent(new InsertSoundEvent(handler));
  }

  onDeleteSound(src, done) {
    this.dispatchEvent(new DeleteSoundEvent(src, done));
  }

  render() {
    if (this._model) {
      const el = React.createElement(Main, {
        classes: {},
        model: this._model,
        configuration: this._configuration,
        onConfigurationChanged: this.onConfigurationChanged,
        onChange: this.onChange,
        uploadSoundSupport: {
          add: this.insertSound.bind(this),
          delete: this.onDeleteSound.bind(this),
        },
      });

      ReactDOM.render(el, this);
    }
  }
}
