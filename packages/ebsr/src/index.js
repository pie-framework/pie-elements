import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import MultipleChoice from '@pie-element/multiple-choice';
import { get } from 'lodash-es';
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

function getPlayerAttributes(element) {
  const player =
    element.closest('pie-player') ||
    element.closest('pie-item-player');

  if (!player) {
    return { baseHeadingLevel: undefined, includeSrHeading: true };
  }

  const getRaw = (camelCaseName, hyphenatedName, allLowerName) => {
    let raw = player[camelCaseName];

    // fallback in case someone sets via HTML attribute manually
    if (raw == null) {
      raw =
        player.getAttribute(hyphenatedName) ??
        player.getAttribute(allLowerName);
    }

    return raw;
  };

  const levelRaw = getRaw('baseHeadingLevel', 'base-heading-level', 'baseheadinglevel');
  const level = parseInt(levelRaw, 10);
  const baseHeadingLevel = Number.isFinite(level) && level >= 1 && level <= 6 ? level : undefined;

  const srRaw = getRaw('includeSrHeading', 'include-sr-heading', 'includesrheading');
  const includeSrHeading = srRaw == null ? true : srRaw !== false && srRaw !== 'false';

  return { baseHeadingLevel, includeSrHeading };
}

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
    if (this._model && this._model[key] && part) {
      const { mode } = this._model;

      part.model = {
        ...this._model[key],
        mode,
        keyMode: this._model[key].choicePrefix,
      };

      // Parts of an EBSR item should not render their own SR headings —
      // the EBSR element itself provides the item-level heading.
      const { includeSrHeading, baseHeadingLevel } = getPlayerAttributes(this);
      part.includeSrHeading = includeSrHeading;
      part.baseHeadingLevel = baseHeadingLevel !== undefined ? Math.min(6, baseHeadingLevel + (includeSrHeading ? 1 : 0)) : undefined;
    }
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
    this._initPlayerObserver();
    this.addEventListener(SESSION_CHANGED, this.onSessionUpdated);
  }

  disconnectedCallback() {
    this._disconnectPlayerObserver();
    this.removeEventListener(SESSION_CHANGED, this.onSessionUpdated);
  }

  _initPlayerObserver() {
    const player = this.closest('pie-player') || this.closest('pie-item-player');
    if (!player) return;

    this._playerObserver = new MutationObserver(() => {
      this._render();
    });
    this._playerObserver.observe(player, {
      attributes: true,
      attributeFilter: ['base-heading-level', 'baseheadinglevel', 'include-sr-heading', 'includesrheading'],
    });
  }

  _disconnectPlayerObserver() {
    if (this._playerObserver) {
      this._playerObserver.disconnect();
      this._playerObserver = null;
    }
  }

  _render() {
    this.ariaLabel = 'Two-Part Question';
    this.role = 'region';

    const { baseHeadingLevel: ebsrLevel, includeSrHeading } = getPlayerAttributes(this);
    const headingTag = ebsrLevel ? `h${Math.min(6, ebsrLevel)}` : 'h2';
    const srHeading = includeSrHeading ? `<${headingTag} class="srOnly">Two-Part Question</${headingTag}>` : '';

    this.innerHTML = `
      <style>
        .srOnly {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        left: -10000px;
        top: auto;
      }
      ${this._model?.extraCSSRules?.rules}
      </style>
        ${srHeading}
        <${MC_TAG_NAME} id="a"></${MC_TAG_NAME}>
        <${MC_TAG_NAME} id="b"></${MC_TAG_NAME}>
    `;

    // when item is re-rendered (due to connectedCallback), if the custom element is already defined,
    // we need to set the model and session, otherwise the setters are not reached again
    if (customElements.get(MC_TAG_NAME)) {
      this.setPartModel(this.partA, 'partA');
      this.setPartModel(this.partB, 'partB');
      this.setPartSession(this.partA, 'partA');
      this.setPartSession(this.partB, 'partB');
    }
  }
}
