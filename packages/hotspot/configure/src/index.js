import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import cloneDeep from 'lodash/cloneDeep';
import defaults from 'lodash/defaults';

import Root from './root';
import sensibleDefaults from './defaults';

const log = debug('hotspot:configure');

const defaultValues = {
  settingsMultipleCorrect: true,
  settingsPartialScoring: true
};

const prepareCustomizationObject = (configure, model) => {
  return {
    configure: defaults(configure, defaultValues),
    model: {
      ...model,
    }
  };
};

export default class HotspotConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...sensibleDefaults,
    ...model,
  });

  constructor() {
    super();
    this._model = HotspotConfigure.createDefaultModel();
    this._configure = defaultValues;
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = HotspotConfigure.createDefaultModel(s);
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
    this._render();
  }

  onRemoveShape = index => {
    const { _model } = this;
    _model.shapes.splice(index, 1);
    this.onModelChanged(_model);
  };

  onColorChanged = (colorType, color) => {
    const { _model } = this;
    _model[colorType] = color;
    this.onModelChanged(_model);
  };

  onPromptChanged = prompt => {
    const { _model } = this;
    const update = cloneDeep(_model);
    _model.prompt = prompt;
    this.onModelChanged(update);
  };

  onPartialScoringChanged = () => {
    const { _model } = this;
    _model.partialScoring = !_model.partialScoring;
    this.onModelChanged(_model);
  };

  onMultipleCorrectChanged = () => {
    const { _model } = this;
    _model.multipleCorrect = !_model.multipleCorrect;
    if (!_model.multipleCorrect) {
      _model.partialScoring = false;
    }
    _model.shapes = _model.shapes.map(shape => ({ ...shape, correct: false }));
    this.onModelChanged(_model);
  };

  onUpdateImageDimension = (dimensions) => {
    const { _model } = this;
    _model.dimensions = dimensions;
    this.onModelChanged(_model);
  };

  onUpdateShapes = (shapes) => {
    const { _model } = this;
    _model.shapes = shapes;
    this.onModelChanged(_model);
  };

  onImageUpload = imageUrl => {
    const { _model } = this;
    _model.imageUrl = imageUrl;
    this.onModelChanged(_model);
  };

  _render() {
    log('_render');
    let element = React.createElement(Root, {
      configure: this._configure,
      disableSidePanel: this._disableSidePanel,
      model: this._model,
      onColorChanged: this.onColorChanged,
      onImageUpload: this.onImageUpload,
      onMultipleCorrectChanged: this.onMultipleCorrectChanged,
      onPartialScoringChanged: this.onPartialScoringChanged,
      onPromptChanged: this.onPromptChanged,
      onRemoveShape: this.onRemoveShape,
      onUpdateImageDimension: this.onUpdateImageDimension,
      onUpdateShapes: this.onUpdateShapes
    });
    ReactDOM.render(element, this);
  }
}
