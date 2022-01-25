import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import MultipleChoice from '@pie-element/multiple-choice';
import { renderMath } from '@pie-lib/math-rendering';
import debug from 'debug';
const MC_TAG_NAME = 'ebsr-multiple-choice';

const log = debug('pie-element:ebsr:print');

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

class EbsrMC extends MultipleChoice {}

const defineMultipleChoice = () => {
  if (!customElements.get(MC_TAG_NAME)) {
    customElements.define(MC_TAG_NAME, EbsrMC);
  }
};

defineMultipleChoice();

export default class EBSRPrint extends HTMLElement {
  constructor() {
    super();
    this._options = null;
    this._model = null;
    this._session = [];

    // this._rerender = debounce(
    //   () => {
    //     if (this._model && this._session) {
    //       console.log(this._model.partA);
    //       console.log(this._model.partB);
    //       this.innerHTML = `
    //   <div>
    //     <${MC_TAG_NAME} id="a"></${MC_TAG_NAME}>
    //     <${MC_TAG_NAME} id="b"></${MC_TAG_NAME}>
    //   </div>
    // `;
    //     }
    //   });
  }

  set options(o) {
    this._options = o;
  }

  get partA() {
    const pA = this.querySelector(`${MC_TAG_NAME}#a`);

    console.log('pA', pA);
    return pA;
  }

  get partB() {
    return this.querySelector(`${MC_TAG_NAME}#b`);
  }

  setPartModel(part, key) {
    if (this._model && this._model[key]) {
      // part.model = preparePrintModel(this._model[key], this._options);
      part.model = {
        ...this._model[key],
        mode: 'gather',
        keyMode: this._model[key].choicePrefix,
      };
    }
  }

  set model(s) {
    this._model = s;

    customElements.whenDefined(MC_TAG_NAME).then((x) => {
      debugger
      console.log('here');
      this.setPartModel(this.partA, 'partA');
      this.setPartModel(this.partB, 'partB');
    });

    this._render();
  }

  setPartSession(part, key) {
    if (this._session && this._model) {
      const { value } = this._session;
      part.session = value && value[key] ? value[key] : { id: key };
    }
  }

  set session(s) {
    this._session = s;

    customElements.whenDefined(MC_TAG_NAME).then(() => {
      this.setPartSession(this.partA, 'partA');
      this.setPartSession(this.partB, 'partB');
    });
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <div>
        <${MC_TAG_NAME} id="a"></${MC_TAG_NAME}>
        <${MC_TAG_NAME} id="b"></${MC_TAG_NAME}>
      </div>
    `;
  }
}
