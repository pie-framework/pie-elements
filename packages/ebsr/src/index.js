import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import MultipleChoice from '@pie-element/multiple-choice';
import get from 'lodash/get';
import debug from 'debug';
const SESSION_CHANGED = SessionChangedEvent.TYPE;
const MC_TAG_NAME = 'ebsr-multiple-choice';
const log = debug('pie-elements:ebsr');

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

  get session() {
    return this._session;
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
