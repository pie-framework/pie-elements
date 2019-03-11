import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import { choiceUtils as utils } from '@pie-lib/config-ui';

import defaults from './defaults';

export default class InlineChoice extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaults,
    ...model,
  });

  constructor() {
    super();
    this.onModelChanged = this.onModelChanged.bind(this);
  }

  set model(s) {
    this._model = utils.normalizeChoices(s);
    this._render();
  }

  dispatchModelUpdated() {
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  onModelChanged(m) {
    this._model = m;
    this.dispatchModelUpdated();
  }

  _render() {
    let element = React.createElement(Root, {
      model: this._model,
      onModelChanged: this.onModelChanged
    });
    ReactDOM.render(element, this);
  }
}
