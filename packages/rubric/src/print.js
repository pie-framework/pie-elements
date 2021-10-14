import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import Main from './main';
import { renderMath } from '@pie-lib/math-rendering';
import debug from 'debug';

const log = debug('pie-element:rubric:print');

const preparePrintModel = (model, opts) => {
  const instr = opts.role === 'instructor';

  if (!instr) {
    return {};
  }

  model.value = { ...model };
  model.mode = 'evaluate';
  model.animationsDisabled = true;

  return model;
};

export default class RubricPrint extends HTMLElement {
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
              ...printModel,
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
