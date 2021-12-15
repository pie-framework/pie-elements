import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import Main from './main';
import { renderMath } from '@pie-lib/math-rendering';
import debug from 'debug';

const log = debug('pie-element:multiple-choice:print');

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
  model.teacherInstructions = instr && model.teacherInstructionsEnabled !== false ? model.teacherInstructions : undefined;
  model.showTeacherInstructions = instr;
  model.alwaysShowCorrect = instr;
  model.mode = instr ? 'evaluate' : model.mode;

  model.disabled = true;
  model.animationsDisabled = true;

  const choices = cloneDeep(model.choices);

  model.choices = choices.map((c) => {
    c.rationale = instr && model.rationaleEnabled !== false ? c.rationale : undefined;
    c.hideTick = instr;
    c.feedback = undefined;
    return c;
  });

  model.keyMode = model.choicePrefix || 'letters';

  return model;
};

export default class MultipleChoicePrint extends HTMLElement {
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
