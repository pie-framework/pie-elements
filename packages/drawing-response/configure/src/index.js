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

export default class DrawableResponseConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...sensibleDefaults.model,
    ...model,
  });

  constructor() {
    super();
    this._model = DrawableResponseConfigure.createDefaultModel();
    this._configuration = sensibleDefaults.configuration;
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = DrawableResponseConfigure.createDefaultModel(s);
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

  onModelChanged = (m, reset) => {
    this._model = m;
    this.dispatchModelUpdated(reset);
    this._render();
  };

  onConfigurationChanged = (c) => {
    this._configuration = c;
    this._render();
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

  onUpdateImageDimension = (dimensions) => {
    console.log('Dimensions: ', dimensions);
    const { _model } = this;
    _model.imageDimensions = dimensions;
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
      imageSupport: {
        add: this.insertImage,
        delete: this.onDeleteImage
      },
      model: this._model,
      onConfigurationChanged: this.onConfigurationChanged,
      onImageUpload: this.onImageUpload,
      onModelChangedByConfig: this.onModelChanged,
      onPromptChanged: this.onPromptChanged,
      onRationaleChanged: this.onRationaleChanged,
      onUpdateImageDimension: this.onUpdateImageDimension
    });
    ReactDOM.render(element, this);
  }
}
