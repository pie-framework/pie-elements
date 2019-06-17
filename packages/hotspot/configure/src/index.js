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

  onModelChangedByConfig = (m, type) => {
    const _model = m;
    if (type === 'multipleCorrect') {
      _model.shapes.rectangles = _model.shapes.rectangles.map(shape => ({ ...shape, correct: false }));
    }
    this.onModelChanged(_model);
  };

  onConfigurationChanged = (c) => {
    this._configuration = c;
    this._render();
  };

  onRemoveShape = index => {
    const { _model } = this;
    _model.shapes.rectangles.splice(index, 1);
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

  onRationaleChanged = rationale => {
    this.onModelChanged({
      ...this._model,
      rationale
    });
  };

  onMultipleCorrectChanged = () => {
    const { _model } = this;
    _model.multipleCorrect = !_model.multipleCorrect;
    if (!_model.multipleCorrect) {
      _model.partialScoring = false;
    }
    _model.shapes.rectangles = _model.shapes.rectangles.map(shape => ({ ...shape, correct: false }));
    this.onModelChanged(_model);
  };

  onUpdateImageDimension = (dimensions) => {
    const { _model } = this;
    _model.dimensions = dimensions;
    this.onModelChanged(_model);
  };

  onUpdateShapes = (shapes) => {
    const { _model } = this;
    _model.shapes.rectangles = shapes;
    this.onModelChanged(_model);
  };

  onImageUpload = imageUrl => {
    const { _model } = this;
    _model.imageUrl = imageUrl;
    this.onModelChanged(_model);
  };

  insertImage = (handler) => {
    this.dispatchEvent(new InsertImageEvent(handler));
  };

  onDeleteImage = (src, done) => {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  };

  _render() {
    log('_render');
    let element = React.createElement(Root, {
      configuration: this._configuration,
      disableSidePanel: this._disableSidePanel,
      model: this._model,
      onColorChanged: this.onColorChanged,
      onImageUpload: this.onImageUpload,
      onRationaleChanged: this.onRationaleChanged,
      onConfigurationChanged: this.onConfigurationChanged,
      onPromptChanged: this.onPromptChanged,
      onRemoveShape: this.onRemoveShape,
      onUpdateImageDimension: this.onUpdateImageDimension,
      imageSupport: {
        add: this.insertImage,
        delete: this.onDeleteImage
      },
      onUpdateShapes: this.onUpdateShapes,
      onModelChangedByConfig: this.onModelChangedByConfig
    });
    ReactDOM.render(element, this);
  }
}
