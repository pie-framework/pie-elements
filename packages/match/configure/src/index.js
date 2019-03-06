import React from 'react';
import ReactDOM from 'react-dom';
import Configure from './configure';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent
} from '@pie-framework/pie-configure-events';
import debug from 'debug';

const log = debug('pie-elements:match:configure');

export default class MatchConfigure extends HTMLElement {
  static prepareModelObject = (model = {}) => {
    const sensibleDefaults = {
      rows: [
        {
          id: 1,
          title: 'Question Text 1',
          values: [false, false]
        }
      ],
      layout: 3,
      headers: ['Column 1', 'Column 2', 'Column 3'],
      responseType: 'radio',
    };

    return {
      ...sensibleDefaults,
      ...model,
    };
  };

  constructor() {
    super();
  }

  set model(m) {
    this._model = MatchConfigure.prepareModelObject(m);
    this._render();
  }

  onModelChanged(model) {
    this._model = model;
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));
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

  _render() {
    if (this._model) {
      const el = React.createElement(Configure, {
        onModelChanged: this.onModelChanged.bind(this),
        model: this._model,
        imageSupport: {
          add: this.insertImage.bind(this),
          delete: this.onDeleteImage.bind(this)
        }
      });
      ReactDOM.render(el, this);
    }
  }
}
