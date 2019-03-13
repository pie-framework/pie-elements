import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';

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
    ...defaults,
    ...model,
  });

  set model(m) {
    this._model = m;
    this.render();
  }

  change(m) {
    this._model = m;
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  render() {
    if (this._model) {
      const element = React.createElement(Root, {
        model: this._model,
        onChange: this.change.bind(this)
      });
      ReactDOM.render(element, this);
    }
  }
}
