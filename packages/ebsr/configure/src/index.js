import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';

import defaults from './defaults';

import debug from 'debug';
const MODEL_UPDATED = ModelUpdatedEvent.TYPE;
const log = debug('pie-elements:ebsr:configure');

class EbsrMCConfigure extends MultipleChoiceConfigure {}

const defineMultipleChoice = () => {
  if (!customElements.get('ebsr-multiple-choice-configure')) {
    customElements.define('ebsr-multiple-choice-configure', EbsrMCConfigure);
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
      e.preventDefault();
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
    this._model = m;

    customElements.whenDefined('ebsr-multiple-choice-configure')
      .then(() => {
        this.partA.model = this._model.partA;
        this.partB.model = this._model.partB;
        this.partA.configure = {
          settingsPartialScoring: false,
          settingsSelectChoiceMode: false
        };
      });
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
        <ebsr-multiple-choice-configure id="part-a-configure"></ebsr-multiple-choice-configure>
        <ebsr-multiple-choice-configure id="part-b-configure"></ebsr-multiple-choice-configure>
      </div>
    `;
  }
}
