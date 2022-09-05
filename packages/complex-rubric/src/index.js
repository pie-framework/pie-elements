import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import Rubric from '@pie-element/rubric';
import MultiTraitRubric from '@pie-element/multi-trait-rubric';
import get from 'lodash/get';
import debug from 'debug';

const SESSION_CHANGED = SessionChangedEvent.TYPE;
const RUBRIC_TAG_NAME = 'complex-rubric-simple';
const MULTI_TRAIT_RUBRIC_TAG_NAME = 'complex-rubric-multi-trait';
const log = debug('pie-elements:ebsr');

class ComplexRubricSimple extends Rubric {}
class ComplexRubricMultiTrait extends MultiTraitRubric {}

const defineRubrics = () => {
  if (!customElements.get(RUBRIC_TAG_NAME)) {
    customElements.define(RUBRIC_TAG_NAME, ComplexRubricSimple);
  }

  if (!customElements.get(MULTI_TRAIT_RUBRIC_TAG_NAME)) {
    customElements.define(MULTI_TRAIT_RUBRIC_TAG_NAME, ComplexRubricMultiTrait);
  }
};

defineRubrics();

const isNonEmptyArray = (a) => Array.isArray(a) && a.length > 0;

export const isSessionComplete = (session) => {
  const a = get(session, 'value.simpleRubric.value');
  const b = get(session, 'value.multiTraitRubric.value');

  return isNonEmptyArray(a) || isNonEmptyArray(b);
};

class ComplexRubric extends HTMLElement {
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

      if (e.update) {
        this._model.rubrics[id] = e.update;
      }
      //TODO: accessing a private property here. The session event should contain the update in future to prevent this.
      this.dispatchSessionChanged(e.srcElement._session, key);
    }
  };

  set model(m) {
    this._model = m;

    customElements.whenDefined(RUBRIC_TAG_NAME).then(() => {
      this.setRubricModel(this.simpleRubric);
    });

    customElements.whenDefined(MULTI_TRAIT_RUBRIC_TAG_NAME).then(() => {
      this.setMultiTraitRubricModel(this.multiTraitRubric);
    });
  }

  set session(s) {
    this._session = s;
  }

  get session() {
    return this._session;
  }

  setRubricModel(simpleRubric) {
    if (this._model && this._model.rubrics && this._model.rubrics.simpleRubric) {
      const { mode } = this._model;

      simpleRubric.model = {
        ...this._model.rubrics.simpleRubric,
        mode
      };
    }
  }

  setMultiTraitRubricModel(multiTraitRubric) {
    if (this._model && this._model.rubrics && this._model.rubrics.multiTraitRubric) {
      const { mode } = this._model;

      multiTraitRubric.model = {
        ...this._model.rubrics.multiTraitRubric,
        mode
      };
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

  get multiTraitRubric() {
    return this.querySelector(`${MULTI_TRAIT_RUBRIC_TAG_NAME}#multiTraitRubric`);
  }

  get simpleRubric() {
    return this.querySelector(`${RUBRIC_TAG_NAME}#simpleRubric`);
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
        <${RUBRIC_TAG_NAME} id="simpleRubric"></${RUBRIC_TAG_NAME}>
        <${MULTI_TRAIT_RUBRIC_TAG_NAME} id="multiTraitRubric"></${MULTI_TRAIT_RUBRIC_TAG_NAME}>
      </div>
    `;
  }
}

export default ComplexRubric;
