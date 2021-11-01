import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import Main from './main';
import { renderMath } from '@pie-lib/math-rendering';

import debug from 'debug';

const log = debug('pie-element:extended-text-entry:print');

const preparePrintModel = (model, opts) => {
  const instr = opts.role === 'instructor';

  model.teacherInstructions = instr ? model.teacherInstructions : undefined;
  model.showTeacherInstructions = instr;
  model.mode = instr ? 'evaluate' : model.mode;

  const defaultDimensions = { height: 100, width: 500 };

  model.dimensions = {
    ...defaultDimensions,
    ...model.dimensions
  };

  model.disabled = true;
  model.feedback = undefined;
  model.animationsDisabled = true;

  return model;
};

export default class ExtendedTextEntryPrint extends HTMLElement {
  constructor() {
    super();
    this._options = null;
    this._model = null;
    this._session = [];
    this._rerender = debounce(
      () => {
        if (this._model && this._session) {
          const printModel = preparePrintModel(this._model, this._options);

          const element =
            this._options &&
            React.createElement(Main, {
              model: printModel,
              session: {},
              onChange: () => {}
            });


          ReactDOM.render(element, this, () => {
            log('render complete - render math');
            renderMath(this);
          });
        } else {
          log('skip');
        }
      },
      50,
      { leading: false, trailing: true }
    );
  }
  set options(o) {
    this._options = o;
  }

  set model(s) {
    this._model = s;
    this._rerender();
  }

  connectedCallback() {}
}
