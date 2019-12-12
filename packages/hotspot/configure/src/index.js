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
    hotspotList: model.hotspotList || [model.hotspotColor] || sensibleDefaults.model.hotspotList,
    outlineList: model.outlineList || [model.outlineColor] || sensibleDefaults.model.outlineList,
    shapes: model.shapes || sensibleDefaults.model.shapes || {}
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
      const { rectangles = [], polygons = [] } = _model.shapes || {};

      _model.shapes.rectangles = rectangles.map(shape => ({ ...shape, correct: false }));
      _model.shapes.polygons = polygons.map(shape => ({ ...shape, correct: false }));
    }

    this.onModelChanged(_model);
  };

  onConfigurationChanged = (c) => {
    this._configuration = c;
    this._render();
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

  onTeacherInstructionsChanged = teacherInstructions => {
    this.onModelChanged({
      ...this._model,
      teacherInstructions
    });
  };

  onMultipleCorrectChanged = () => {
    const { _model } = this;

    _model.multipleCorrect = !_model.multipleCorrect;

    if (!_model.multipleCorrect) {
      _model.partialScoring = false;
    }

    const { rectangles = [], polygons = [] } = _model.shapes || {};

    _model.shapes.rectangles = rectangles.map(shape => ({ ...shape, correct: false }));
    _model.shapes.polygons = polygons.map(shape => ({ ...shape, correct: false }));

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
      onUpdateImageDimension: this.onUpdateImageDimension,
      imageSupport: {
        add: this.insertImage,
        delete: this.onDeleteImage
      },
      onUpdateShapes: this.onUpdateShapes,
      onModelChangedByConfig: this.onModelChangedByConfig,
      onTeacherInstructionsChanged: this.onTeacherInstructionsChanged,
    });
    ReactDOM.render(element, this);
  }
}
