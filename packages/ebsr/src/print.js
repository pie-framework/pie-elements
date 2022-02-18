import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import MultipleChoice from '@pie-element/multiple-choice';
import debug from 'debug';
import get from 'lodash/get';

import {SessionChangedEvent} from '@pie-framework/pie-player-events';
const MC_TAG_NAME = 'ebsr-multiple-choice';
const SESSION_CHANGED = SessionChangedEvent.TYPE;

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

const isNonEmptyArray = (a) => Array.isArray(a) && a.length > 0;

export const isSessionComplete = (session) => {
  const a = get(session, 'value.partA.value');
  const b = get(session, 'value.partB.value');

  return isNonEmptyArray(a) && isNonEmptyArray(b);
};

export default class Ebsr extends HTMLElement {
  constructor() {
    super();
    this._model = {};
    this._session = {};
  }

  onSessionUpdated = (e) => {
    if (e.target === this) {
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    const id = e.target.getAttribute('id');

    if (id) {
      const key = `part${id.toUpperCase()}`;

      if (e.update) {
        this._model[key] = e.update;
      }
      //TODO: accessing a private property here. The session event should contain the update in future to prevent this.
      this.dispatchSessionChanged(e.srcElement._session, key);
    }
  };

  set model(m) {
    this._model = m;

    customElements.whenDefined(MC_TAG_NAME).then(() => {
      this.setPartModel(this.partA, 'partA');
      this.setPartModel(this.partB, 'partB');
    });
  }

  set session(s) {
    this._session = s;

    customElements.whenDefined(MC_TAG_NAME).then(() => {
      this.setPartSession(this.partA, 'partA');
      this.setPartSession(this.partB, 'partB');
    });
  }

  setPartModel(part, key) {
    if (this._model && this._model[key]) {
      const { mode } = this._model;

      part.model = {
        ...this._model[key],
        mode,
        keyMode: this._model[key].choicePrefix,
      };
    }
  }

  setPartSession(part, key) {
    if (this._session && this._model) {
      const { value } = this._session;
      part.session = value && value[key] ? value[key] : { id: key };
    }
  }

  dispatchSessionChanged(partSession, key) {
    this._session.value = {
      ...this._session.value,
      [key]: partSession,
    };

    log('[onSessionChanged] session: ', this._session);
    const complete = isSessionComplete(this._session);
    this.dispatchEvent(
      new SessionChangedEvent(this.tagName.toLowerCase(), complete)
    );
  }

  get partA() {
    return this.querySelector(`${MC_TAG_NAME}#a`);
  }

  get partB() {
    return this.querySelector(`${MC_TAG_NAME}#b`);
  }

  connectedCallback() {
    this._render();
    this.addEventListener(SESSION_CHANGED, this.onSessionUpdated);
  }

  disconnectedCallback() {
    this.removeEventListener(SESSION_CHANGED, this.onSessionUpdated);
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
