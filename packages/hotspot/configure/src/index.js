import {
  DeleteImageEvent,
  InsertImageEvent,
  ModelUpdatedEvent
} from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import debug from 'debug';
import defaults from 'lodash/defaults';

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
  }

  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  _render() {
    log('_render');
    let element = React.createElement(Root, {
      configure: this._configure,
      disableSidePanel: this._disableSidePanel,
      model: this._model,
      onModelChanged: this.onModelChanged
    });
    ReactDOM.render(element, this);
  }
}
