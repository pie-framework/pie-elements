import Rubric from '@pie-element/rubric';
import MultiTraitRubric from '@pie-element/multi-trait-rubric';
import { RUBRIC_TYPES } from '@pie-lib/rubric';

const RUBRIC_TAG_NAME = 'complex-rubric-simple';
const MULTI_TRAIT_RUBRIC_TAG_NAME = 'complex-rubric-multi-trait';

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

class ComplexRubric extends HTMLElement {
  constructor() {
    super();
    this._model = {};
    this._type = RUBRIC_TYPES.SIMPLE_RUBRIC;
  }

  set type(t) {
    this._type = t;
  }

  get type() {
    return this._type;
  }

  set model(m) {
    this._model = m;
    const oldType = this._type;
    this.type = m.rubricType;

    switch (this._type) {
      case RUBRIC_TYPES.SIMPLE_RUBRIC:
      default:
        customElements.whenDefined(RUBRIC_TAG_NAME).then(() => {
          this.setRubricModel(this.simpleRubric);
        });
        break;
      case RUBRIC_TYPES.MULTI_TRAIT_RUBRIC:
        customElements.whenDefined(MULTI_TRAIT_RUBRIC_TAG_NAME).then(() => {
          this.setMultiTraitRubricModel(this.multiTraitRubric);
        });
        break;
    }

    if (oldType !== this.type) {
      this._render();
    }
  }

  setRubricModel(simpleRubric) {
    if (this._model && this._model.rubrics && this._model.rubrics.simpleRubric) {
      const { mode } = this._model;

      simpleRubric.model = {
        ...this._model.rubrics.simpleRubric,
        mode,
      };
    }
  }

  setMultiTraitRubricModel(multiTraitRubric) {
    if (this._model && this._model.rubrics && this._model.rubrics.multiTraitRubric) {
      const { mode } = this._model;

      multiTraitRubric.model = {
        ...this._model.rubrics.multiTraitRubric,
        mode,
      };
    }
  }

  get multiTraitRubric() {
    return this.querySelector(`${MULTI_TRAIT_RUBRIC_TAG_NAME}#multiTraitRubric`);
  }

  get simpleRubric() {
    return this.querySelector(`${RUBRIC_TAG_NAME}#simpleRubric`);
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = `
      <div>
        <div style="${
          this._type === RUBRIC_TYPES.SIMPLE_RUBRIC ? `visibility: visible` : `visibility: hidden`
        }"><${RUBRIC_TAG_NAME} id="simpleRubric"></${RUBRIC_TAG_NAME}></div>
        <div style="${
          this._type !== RUBRIC_TYPES.SIMPLE_RUBRIC ? `visibility: visible` : `visibility: hidden`
        }"> <${MULTI_TRAIT_RUBRIC_TAG_NAME} id="multiTraitRubric"></${MULTI_TRAIT_RUBRIC_TAG_NAME}></div>
      </div>
    `;
  }
}

export default ComplexRubric;
