import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent
} from '@pie-framework/pie-configure-events';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';

import defaults from './defaults';

const csToUi = cs => {};
/**
 *
 * @param
 * {"{"width":"200px","height":"100px","disabled":true,"mode":"evaluate","feedback":{"type":"default","default":"Your answer has been submitted","customFeedback":"<div>Thank you very much</div>"},"id":"1","element":"extended-text-entry","value":"<div>asrt</div>","mathEnabled":false}"} ui
 */
const uiToCs = ui => {};
export default class ExtendedTextEntry extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaults.model,
    ...model
  });

  constructor() {
    super();
    this._model = ExtendedTextEntry.createDefaultModel();
    this._configuration = defaults.configuration;
  }

  set model(m) {
    this._model = ExtendedTextEntry.createDefaultModel(m);
    this.render();
  }

  set configuration(c) {
    this._configuration = {
      ...defaults.configuration,
      ...c
    };

    this.render();
  }

  onModelChanged(m) {
    this._model = m;
    this.render();
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  onConfigurationChanged(c) {
    this._configuration = {
      ...defaults.configuration,
      ...c
    };

    if (this._model) {
      this.onModelChanged(this._model);
    }

    this.render();
  }


  /**
   *
   * @param {done, progress, file} handler
   */
  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  render() {
    if (this._model) {
      const element = React.createElement(Main, {
        model: this._model,
        configuration: this._configuration,
        onModelChanged: this.onModelChanged.bind(this),
        onConfigurationChanged: this.onConfigurationChanged.bind(this),
        imageSupport: {
          add: this.insertImage.bind(this),
          delete: this.onDeleteImage.bind(this)
        }
      });
      ReactDOM.render(element, this);
    }
  }
}
