import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import defaults from 'lodash/defaults';
import isArray from 'lodash/isArray';
import {
  DeleteImageEvent,
  InsertImageEvent,
  ModelUpdatedEvent
} from '@pie-framework/pie-configure-events';

import Main from './main';

import sensibleDefaults from './defaults';
import { processMarkup, createSlateMarkup } from './markupUtils'

const log = debug('explicit-constructed-response:configure');

export default class ExplicitConstructedResponse extends HTMLElement {
  static prepareModel = (model = {}) => {
    const joinedObj = {
      ...sensibleDefaults.model,
      ...model,
    };
    const slateMarkup = joinedObj.slateMarkup || createSlateMarkup(joinedObj.markup, joinedObj.choices);
    const processedMarkup = processMarkup(slateMarkup);

    // this was added to treat an exception, when the model has choices without the "value" property
    // like: { label: 'test' }
    if (joinedObj.choices) {
      Object.keys(joinedObj.choices).forEach(key => {
        if (isArray(joinedObj.choices[key])) {
          joinedObj.choices[key] = (joinedObj.choices[key] || []).map((item, index) => {
            if (!item.value) {
              log('Choice does not contain "value" property, which is required.', item);
              return { value: `${index}`, ...item };
            }

            return item;
          })
        }
      });
    }

    return {
      ...joinedObj,
      slateMarkup,
      markup: processedMarkup
    };
  };

  constructor() {
    super();
    this._model = ExplicitConstructedResponse.prepareModel();
    this._configuration = sensibleDefaults.configuration;
    this.onModelChanged = this.onModelChanged.bind(this);
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  set model(s) {
    this._model = ExplicitConstructedResponse.prepareModel(s);
    this._render();
  }

  set configuration(c) {
    this._configuration = defaults(c, sensibleDefaults.configuration);
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
    this._model = ExplicitConstructedResponse.prepareModel(m);
    this._render();
    this.dispatchModelUpdated(reset);
  }

  onConfigurationChanged(c) {
    this._configuration = c;
    this._render();
  }

  /** @param {done, progress, file} handler */
  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  _render() {
    log('_render');
    let element = React.createElement(Main, {
      model: this._model,
      configuration: this._configuration,
      onModelChanged: this.onModelChanged,
      onConfigurationChanged: this.onConfigurationChanged,
      disableSidePanel: this._disableSidePanel,
      imageSupport: {
        add: this.insertImage.bind(this),
        delete: this.onDeleteImage.bind(this)
      }
    });
    ReactDOM.render(element, this);
  }
}
