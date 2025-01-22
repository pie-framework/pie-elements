import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import Main from './main';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import debug from 'debug';

const log = debug('pie-element:select-text:print');

/**
 * Live in same package as main element - so we can access some of the shared comps!
 *
 * - update pslb to build print if src/print.js is there
 * - update demo el
 * - get configure/controller building
 */

const preparePrintModel = (model, opts) => {
  const instr = opts.role === 'instructor';

  model.prompt = model.promptEnabled !== false ? model.prompt : undefined;
  model.teacherInstructions =
    instr && model.teacherInstructionsEnabled !== false ? model.teacherInstructions : undefined;
  model.rationale = instr && model.rationaleEnabled !== false ? model.rationale : undefined;
  model.showTeacherInstructions = instr;
  model.alwaysShowCorrect = instr;
  model.mode = instr ? 'evaluate' : model.mode;

  model.disabled = true;
  model.animationsDisabled = true;
  model.highlightChoices = true;
  model.feedback = undefined;

  return model;
};

export default class SelectTextPrint extends HTMLElement {
  constructor() {
    super();
    this._options = null;
    this._model = null;
    this._session = {};
    this._session.selectedTokens = [];
    this._rerender = debounce(
      () => {
        if (this._model && this._session) {
          const printModel = preparePrintModel(this._model, this._options);

          const element =
            this._options &&
            React.createElement(Main, {
              model: printModel,
              session: { selectedTokens: [] },
              onSelectionChange: () => {},
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
