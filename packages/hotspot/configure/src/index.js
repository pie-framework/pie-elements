import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
} from '@pie-framework/pie-configure-events';

import Root from './root';
import sensibleDefaults from './defaults';

const log = debug('hotspot:configure');

export default class HotspotConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...sensibleDefaults.model,
    ...model,
    hotspotList: model.hotspotList || [model.hotspotColor] || sensibleDefaults.model.hotspotList,
    outlineList: model.outlineList || [model.outlineColor] || sensibleDefaults.model.outlineList,
    shapes: model.shapes || sensibleDefaults.model.shapes || {},
  });

  constructor() {
    super();
    this._model = HotspotConfigure.createDefaultModel();
    this._configuration = sensibleDefaults.configuration;
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = HotspotConfigure.createDefaultModel(s);
    this._render();
  }

  set configuration(c) {
    const newConfiguration = {
      ...sensibleDefaults.configuration,
      ...c,
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
      if (!this._configuration.languageChoices.options.find((option) => option.value === this._model.language)) {
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

  dispatchModelUpdated(reset) {
    const resetValue = !!reset;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, resetValue));
  }

  onModelChanged(m, reset) {
    this._model = m;
    this.dispatchModelUpdated(reset);
    this._render();
  }

  onConfigurationChanged = (c) => {
    this._configuration = c;
    this._render();
  };

  onModelChangedByConfig = (m, propertyType) => {
    const _model = m;

    if (propertyType === 'multipleCorrect') {
      const { rectangles = [], polygons = [], circles = [] } = _model.shapes || {};

      _model.shapes.rectangles = rectangles.map((shape) => ({ ...shape, correct: false }));
      _model.shapes.polygons = polygons.map((shape) => ({ ...shape, correct: false }));
      _model.shapes.circles = circles.map((shape) => ({ ...shape, correct: false }));
    }

    this.onModelChanged(_model);
  };

  onColorChanged = (colorType, color) => {
    this.onModelChanged({
      ...this._model,
      [colorType]: color,
    });
  };

  onPromptChanged = (prompt) => {
    this.onModelChanged({
      ...this._model,
      prompt,
    });
  };

  onRationaleChanged = (rationale) => {
    this.onModelChanged({
      ...this._model,
      rationale,
    });
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    this.onModelChanged({
      ...this._model,
      teacherInstructions,
    });
  };

  onUpdateImageDimension = (dimensions) => {
    this.onModelChanged({
      ...this._model,
      dimensions,
    });
  };

  onUpdateShapes = (shapes) => {
    this.onModelChanged({
      ...this._model,
      shapes,
    });
  };

  onImageUpload = (imageUrl) => {
    this.onModelChanged({
      ...this._model,
      imageUrl,
    });
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
    log('_render');
    let element = React.createElement(Root, {
      configuration: this._configuration,
      model: this._model,
      onColorChanged: this.onColorChanged,
      onImageUpload: this.onImageUpload,
      onRationaleChanged: this.onRationaleChanged,
      onConfigurationChanged: this.onConfigurationChanged,
      onPromptChanged: this.onPromptChanged,
      onUpdateImageDimension: this.onUpdateImageDimension,
      imageSupport: {
        add: this.insertImage,
        delete: this.onDeleteImage,
      },
      uploadSoundSupport: {
        add: this.insertSound.bind(this),
        delete: this.onDeleteSound.bind(this),
      },
      onUpdateShapes: this.onUpdateShapes,
      onModelChangedByConfig: this.onModelChangedByConfig,
      onTeacherInstructionsChanged: this.onTeacherInstructionsChanged,
    });

    ReactDOM.render(element, this);
  }
}
