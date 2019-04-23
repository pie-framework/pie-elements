import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';

import defaults from './defaults';

const MODEL_UPDATED = ModelUpdatedEvent.TYPE;
const MC_TAG_NAME = 'ebsr-multiple-choice-configure';

class EbsrMCConfigure extends MultipleChoiceConfigure {}

const defineMultipleChoice = () => {
  if (!customElements.get(MC_TAG_NAME)) {
    customElements.define(MC_TAG_NAME, EbsrMCConfigure);
  }
};

defineMultipleChoice();

export default class EbsrConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaults,
    ...model
  });

  constructor() {
    super();
    this._model = EbsrConfigure.createDefaultModel();
  }

  onModelUpdated = e => {
    if (e.target === this) {
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    const id = e.target.getAttribute('id');
    if (id) {
      this._model[`part${id.toUpperCase()}`] = e.update;
      this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
    }
  };

  set model(m) {
    this._model = m;

    customElements.whenDefined(MC_TAG_NAME).then(() => {
      this.partA.model = this._model.partA;
      this.partB.model = this._model.partB;
      this.partA.configure = {
        ...defaults.partA.configure,
        ...this.partA.configure,
      };
      this.partB.configure = {
        ...defaults.partB.configure,
        ...this.partB.configure,
      };
    });
  }

  connectedCallback() {
    this.addEventListener(MODEL_UPDATED, this.onModelUpdated);
    this._render();
  }

  disconnectedCallback() {
    this.removeEventListener(MODEL_UPDATED, this.onModelUpdated);
  }

  get partA() {
    return this.querySelector(`${MC_TAG_NAME}#a`);
  }

  get partB() {
    return this.querySelector(`${MC_TAG_NAME}#b`);
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
