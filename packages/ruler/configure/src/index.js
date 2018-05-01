import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';

const defaultModel = () => ({
  model: {
    config: {
      units: 'imperial',
      length: 12,
      ticks: 8,
      pixelsPerUnit: 40,
      label: 'in'
    }
  }
});

export default class RulerConfigure extends HTMLElement {
  connectedCallback() {
    setTimeout(() => {
      if (!this._model) {
        this._model = defaultModel();
        this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
        this.render();
      }
    }, 100);
  }

  set model(m) {
    console.log('m?', m);
    this._model = m;
    this.render();
  }

  onChange(m) {
    this._model = m;
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  render() {
    if (this._model) {
      const el = React.createElement(Main, {
        model: this._model,
        onChange: this.onChange.bind(this)
      });
      ReactDOM.render(el, this);
    }
  }
}
