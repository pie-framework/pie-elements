import Rubric from '@pie-element/rubric';
import MultiTraitRubric from '@pie-element/multi-trait-rubric';
import { RUBRIC_TYPES } from '@pie-lib/rubric';

const RUBRIC_TAG_NAME = 'complex-rubric-simple';
const MULTI_TRAIT_RUBRIC_TAG_NAME = 'complex-rubric-multi-trait';

class ComplexRubricSimple extends Rubric {}
class ComplexRubricMultiTrait extends MultiTraitRubric {}

const preparePrintModel = (model, opts) => {
  const instr = opts.role === 'instructor';

  if (!instr) {
    return {};
  }

  model.mode = 'evaluate';
  model.animationsDisabled = true;

  return model;
};

const defineRubrics = () => {
  if (!customElements.get(RUBRIC_TAG_NAME)) {
    customElements.define(RUBRIC_TAG_NAME, ComplexRubricSimple);
  }

  if (!customElements.get(MULTI_TRAIT_RUBRIC_TAG_NAME)) {
    customElements.define(MULTI_TRAIT_RUBRIC_TAG_NAME, ComplexRubricMultiTrait);
  }
};

defineRubrics();

class ComplexRubricPrint extends HTMLElement {
  constructor() {
    super();
    this._model = {};
    this._type = RUBRIC_TYPES.SIMPLE_RUBRIC;
    this._options = null;
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

      simpleRubric.model = {
        ...preparePrintModel(this._model.rubrics.simpleRubric, this._options),
        mode: 'evaluate',
        animationsDisabled: true
      };
    }
  }

  setMultiTraitRubricModel(multiTraitRubric) {
    if (this._model && this._model.rubrics && this._model.rubrics.multiTraitRubric) {
      const { scales, excludeZero } = this._model.rubrics.multiTraitRubric || {};
      const parsedScales = (scales || []).map((scale) => ({ ...scale, excludeZero }));

      multiTraitRubric.model = {
        ...preparePrintModel(this._model.rubrics.multiTraitRubric, this._options),
        mode: 'evaluate',
        visible: true,
        animationsDisabled: true,
        arrowsDisabled: true,
        scales: parsedScales,
      };
    }
  }

  set options(o) {
    this._options = o;
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
    this.innerHTML = this._type === RUBRIC_TYPES.SIMPLE_RUBRIC
      ? `<${RUBRIC_TAG_NAME} id="simpleRubric" />`
      : `<${MULTI_TRAIT_RUBRIC_TAG_NAME} id="multiTraitRubric" />`;
  }
}

export default ComplexRubricPrint;
