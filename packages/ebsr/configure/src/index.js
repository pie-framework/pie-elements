import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';

import defaults from './defaults';

import debug from 'debug';
const MODEL_UPDATED = ModelUpdatedEvent.TYPE;
const log = debug('pie-elements:ebsr:configure');

const defineMultipleChoice = () => {
  if (!customElements.get('multiple-choice-configure')) {
    customElements.define('multiple-choice-configure', MultipleChoiceConfigure);
  }
};

export default class EbsrConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...defaults,
    ...model,
  });

  constructor() {
    super();
    defineMultipleChoice();
    this.onPartUpdated = e => {
      e.stopImmediatePropagation();
      const key =
        e.target.getAttribute('id') === 'part-a-configure' ? 'partA' : 'partB';
      this.handleUpdate(e, key);
    };

    this._model = EbsrConfigure.createDefaultModel();
  }

  handleUpdate(e, key) {
    this._model[key] = e.update;
    this.dispatchModelChanged();
  }

  set model(m) {
    this._model = EbsrConfigure.createDefaultModel(m);
    this.partA.model = this._model.partA;
    this.partB.model = this._model.partB;
  }

  connectedCallback() {
    this._render();
    this.partA.addEventListener(MODEL_UPDATED, this.onPartUpdated);
    this.partB.addEventListener(MODEL_UPDATED, this.onPartUpdated);
  }

  disconnectedCallback() {
    this.partA.removeEventListener(MODEL_UPDATED, this.onPartUpdated);
    this.partB.removeEventListener(MODEL_UPDATED, this.onPartUpdated);
  }

  get partA() {
    return this.querySelector('#part-a-configure');
  }

  get partB() {
    return this.querySelector('#part-b-configure');
  }

  dispatchModelChanged() {
    log('[onModelChanged]: ', this._model);
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  }

  _render() {
    this.innerHTML = `
      <div>
        <multiple-choice-configure id="part-a-configure"></multiple-choice-configure>
        <multiple-choice-configure id="part-b-configure"></multiple-choice-configure>
      </div>
    `;
  }
}
