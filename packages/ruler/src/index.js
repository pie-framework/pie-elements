import React from 'react';
import ReactDOM from 'react-dom';

import { RulerComponent } from '@pie-ui/ruler';

/** Convert corespring ruler model to @pie-ui/ruler model */

const convert = m => {
  const {
    model: { config }
  } = m;
  return {
    measure: config.units,
    units: config.length,
    width: config.length * config.pixelsPerUnit,
    label: config.label,
    imperialTicks: config.ticks
  };
};

export default class Ruler extends HTMLElement {
  set model(m) {
    this._model = m;
    this.render();
  }

  render() {
    if (this._model) {
      const el = React.createElement(RulerComponent, {
        model: convert(this._model)
      });
      ReactDOM.render(el, this);
    }
  }
}
