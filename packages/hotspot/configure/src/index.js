import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
} from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import cloneDeep from 'lodash/cloneDeep';

import Root from './root';
import sensibleDefaults from './defaults';

const log = debug('hotspot:configure');

export default class HotspotConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...sensibleDefaults.model,
    ...model,
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
    this._configuration = c;
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

  onConfigurationChanged(c) {
    this._configuration = c;
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
    update.prompt = prompt;
    this.onModelChanged(update);
  };

  onPartialScoringChanged = () => {
    const { _model } = this;
    _model.partialScoring = !_model.partialScoring;
    this.onModelChanged(_model);
  };

  onRationaleChanged = rationale => {
    this.onModelChanged({
      ...this._model,
      rationale
    });
  };

  onConfigurationChanged = c => {
    this._configuration = c;

    this._render();
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

  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  _render() {
    log('_render');
    let element = React.createElement(Root, {
      configuration: this._configuration,
      disableSidePanel: this._disableSidePanel,
      model: this._model,
      onColorChanged: this.onColorChanged,
      onImageUpload: this.onImageUpload,
      onRationaleChanged: this.onRationaleChanged.bind(this),
      onConfigurationChanged: this.onConfigurationChanged.bind(this),
      onPromptChanged: this.onPromptChanged,
      onRemoveShape: this.onRemoveShape,
      onUpdateImageDimension: this.onUpdateImageDimension,
      imageSupport: {
        add: this.insertImage.bind(this),
        delete: this.onDeleteImage.bind(this)
      },
      onUpdateShapes: this.onUpdateShapes,
      onModelChanged: this.onModelChanged
    });
    ReactDOM.render(element, this);
  }
}
