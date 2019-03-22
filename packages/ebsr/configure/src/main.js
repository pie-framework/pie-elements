import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';

import debug from 'debug';

const log = debug('pie-elements:ebsr:configure');

export default class Main extends HTMLElement {
  static defineMultipleChoice() {
    if(!customElements.get('multiple-choice-configure')){
      customElements.define('multiple-choice-configure', MultipleChoiceConfigure);
    }
  }

  static getParts = () => ({
    partA: document.getElementById('part-a-configure'),
    partB: document.getElementById('part-b-configure'),
  });

  constructor() {
    super();

    Main.defineMultipleChoice();
  }

  set model(m) {
    this._model = m;

    this._render();
    this.setupModel();
  }

  setupModel() {
    const { partA, partB } = Main.getParts();

    if (partA && partB) {
      this.setupPart(partA, 'partA');
      this.setupPart(partB, 'partB');
    }
  }

  setupPart(part, key) {
    this.initiatePart(part, key);
    this.captureModelUpdated(part, key);
  }

  initiatePart(part, key) {
    part.model = this._model[key];

    this.dispatchModelChanged();
  }

  dispatchModelChanged(reset = false) {
    log('[onModelChanged]: ', this._model);

    this.dispatchEvent(new ModelUpdatedEvent(this._model, reset));
  }

  captureModelUpdated(part, key) {
    const self = this;

    part.addEventListener('model.updated', event => {
      event.stopImmediatePropagation();
      self.repackModel(event.update, key);
    });
  }

  repackModel(partModel, key) {
    this._model =  {
      ...this._model,
      [key]: partModel
    };

    this.dispatchModelChanged();
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
