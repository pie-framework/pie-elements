import React from 'react';
import ReactDOM from 'react-dom';
import Main from './design';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
} from '@pie-framework/pie-configure-events';
import defaultValues from './defaults';
import {createSlateMarkup, processMarkup} from './markupUtils';

export default class MathTemplateConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => {
    const joinedObj = {
      ...defaultValues.model,
      ...model,
    };
    const slateMarkup = joinedObj.slateMarkup || createSlateMarkup(joinedObj.markup);
    const processedMarkup = processMarkup(slateMarkup);

    return {
      ...joinedObj,
      slateMarkup,
      markup: processedMarkup,
    };
  };



  constructor() {
    super();
    this._model = MathTemplateConfigure.createDefaultModel();

    this._configuration = defaultValues.configuration;
  }

  set model(m) {
    this._model = MathTemplateConfigure.createDefaultModel(m);

    this.render();
  }

  set configuration(c) {
    this._configuration = c;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  modelChanged(m) {
    this._model = m;

    this.dispatchEvent(new ModelUpdatedEvent(this._model), true);
    this.render();
  }

  onConfigurationChanged(c) {
    this._configuration = c;

    this.render();
  }

  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  insertSound(handler) {
    this.dispatchEvent(new InsertSoundEvent(handler));
  }

  onDeleteSound(src, done) {
    this.dispatchEvent(new DeleteSoundEvent(src, done));
  }

  render() {
    console.log(this._model.markup);
    console.log(this._model.responses);
    if (this._model) {
      const el = React.createElement(Main, {
        model: this._model,
        configuration: this._configuration,
        onModelChanged: this.modelChanged.bind(this),
        onConfigurationChanged: this.onConfigurationChanged.bind(this),
        imageSupport: {
          add: this.insertImage.bind(this),
          delete: this.onDeleteImage.bind(this),
        },
        uploadSoundSupport: {
          add: this.insertSound.bind(this),
          delete: this.onDeleteSound.bind(this),
        },
      });

      ReactDOM.render(el, this);
    }
  }
}
