import { cloneDeep, get } from 'lodash-es';
import MultipleChoice from '@pie-element/multiple-choice';
import debug from 'debug';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';
const MC_TAG_NAME = 'ebsr-multiple-choice';
const SESSION_CHANGED = SessionChangedEvent.TYPE;
import Translator from '@pie-lib/translator';

const { translator } = Translator;

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
  const printModel = cloneDeep(model);

  printModel.prompt = printModel.promptEnabled !== false ? printModel.prompt : undefined;
  printModel.teacherInstructions =
    instr && printModel.teacherInstructionsEnabled !== false ? printModel.teacherInstructions : undefined;
  printModel.showTeacherInstructions = instr;
  printModel.alwaysShowCorrect = instr;
  printModel.mode = instr ? 'evaluate' : 'gather';

  printModel.disabled = true;
  printModel.animationsDisabled = true;
  printModel.lockChoiceOrder = true;
  printModel.choicesLayout = printModel.choicesLayout || 'vertical';

  printModel.choices = (printModel.choices || []).map((c) => {
    c.rationale = instr && printModel.rationaleEnabled !== false ? c.rationale : undefined;
    c.hideTick = instr;
    c.feedback = undefined;
    return c;
  });

  printModel.keyMode = printModel.choicePrefix || 'letters';

  return printModel;
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
    this._options = null;
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
    this._updateParts();
  }

  set session(s) {
    this._session = s;

    customElements.whenDefined(MC_TAG_NAME).then(() => {
      this.setPartSession(this.partA, 'partA');
      this.setPartSession(this.partB, 'partB');
    });
  }

  _updateParts() {
    customElements.whenDefined(MC_TAG_NAME).then(() => {
      this.setPartModel(this.partA, 'partA');
      this.setPartModel(this.partB, 'partB');
    });
  }

  setPartModel(part, key) {
    if (this._model && this._model[key] && part && this._options) {
      let labels = {
        partA: undefined,
        partB: undefined,
      };

      if (this._model.partLabels) {
        const language = this._model.language;

        labels = {
          partA: translator.t('ebsr.part', {
            lng: language,
            index: this._model.partLabelType === 'Letters' ? 'A' : '1',
          }),
          partB: translator.t('ebsr.part', {
            lng: language,
            index: this._model.partLabelType === 'Letters' ? 'B' : '2',
          }),
        };
      }

      part.model = {
        ...preparePrintModel(this._model[key], this._options),
        keyMode: this._model[key].choicePrefix,
        partLabel: labels[key],
      };

      // pass options to enable print mode detection in multiple-choice component
      part.options = this._options;

      if (!part._session) {
        // for print, "set session" is not called,
        // but ebsr needs sessions in order to render the elements,
        // so we set it here it was not set already
        part.session = {};
      }
    }
  }

  set options(o) {
    this._options = o;
    // re-render parts so role changes (student/instructor) propagate to each part
    this._updateParts();
  }

  setPartSession(part, key) {
    if (this._session && this._model && part) {
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
    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), complete));
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
