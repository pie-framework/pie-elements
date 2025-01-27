import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import Main from './main';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import debug from 'debug';

const log = debug('pie-element:explicit-constructed-response:print');

const preparePrintModel = (model, opts) => {
  const isInstructor = opts.role === 'instructor';

  model.prompt = model.promptEnabled !== false ? model.prompt : undefined;
  model.teacherInstructions =
    isInstructor && model.teacherInstructionsEnabled !== false ? model.teacherInstructions : undefined;
  model.rationale = isInstructor && model.rationaleEnabled !== false ? model.rationale : undefined;
  model.alwaysShowCorrect = isInstructor;
  model.mode = isInstructor ? 'evaluate' : model.mode;
  model.disabled = true;
  model.animationsDisabled = true;

  return model;
};

export default class ExplicitConstructedResponsePrint extends HTMLElement {
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
              onChange: () => {},
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
      { leading: false, trailing: true },
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
