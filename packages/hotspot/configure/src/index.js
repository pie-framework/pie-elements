import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
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
      const { rectangles = [], polygons = [] } = _model.shapes || {};

      _model.shapes.rectangles = rectangles.map(shape => ({ ...shape, correct: false }));
      _model.shapes.polygons = polygons.map(shape => ({ ...shape, correct: false }));
    }

    this.onModelChanged(_model);
  };

  onColorChanged = (colorType, color) => {
    this.onModelChanged({
      ...this._model,
      [colorType]: color
    });
  };

  onPromptChanged = prompt => {
    this.onModelChanged({
      ...this._model,
      prompt
    });
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

  onUpdateImageDimension = dimensions => {
    this.onModelChanged({
      ...this._model,
      dimensions
    });
  };

  onUpdateShapes = shapes => {
    this.onModelChanged({
      ...this._model,
      shapes
    });
  };

  onImageUpload = imageUrl => {
    this.onModelChanged({
      ...this._model,
      imageUrl
    });
  };

  insertImage = handler => {
    this.dispatchEvent(new InsertImageEvent(handler));
  };

  onDeleteImage = (src, done) => {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  };

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
        delete: this.onDeleteImage
      },
      onUpdateShapes: this.onUpdateShapes,
      onModelChangedByConfig: this.onModelChangedByConfig,
      onTeacherInstructionsChanged: this.onTeacherInstructionsChanged,
    });

    ReactDOM.render(element, this);
  }
}
