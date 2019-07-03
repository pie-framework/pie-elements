import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

import Root from './root';
import sensibleDefaults from './defaults';

const log = debug('image-cloze-association:configure');

export default class ImageClozeAssociationConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...sensibleDefaults.model,
    ...model,
  });

  constructor() {
    super();
    this._model = ImageClozeAssociationConfigure.createDefaultModel();
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = ImageClozeAssociationConfigure.createDefaultModel(s);
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

  _render() {
    log('_render');
    let element = React.createElement(Root, {
      disableSidePanel: this._disableSidePanel,
      model: this._model
    });
    ReactDOM.render(element, this);
  }
}
