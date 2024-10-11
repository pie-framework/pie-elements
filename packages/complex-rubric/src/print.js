// here it is actually using rubric/src/index.js, instead of using rubric/src/print.js
import Rubric from '@pie-element/rubric';
// here it is actually using multi-trait-rubric/src/index.js, instead of using multi-trait-rubric/src/print.js
import MultiTraitRubric from '@pie-element/multi-trait-rubric';
import { RUBRIC_TYPES } from '@pie-lib/pie-toolbox/rubric';

const RUBRIC_TAG_NAME = 'complex-rubric-simple';
const MULTI_TRAIT_RUBRIC_TAG_NAME = 'complex-rubric-multi-trait';

class ComplexRubricSimple extends Rubric {}
class ComplexRubricMultiTrait extends MultiTraitRubric {}

const rubricTags = {
  [RUBRIC_TYPES.SIMPLE_RUBRIC]: `<${RUBRIC_TAG_NAME} id="simpleRubric" />`,
  [RUBRIC_TYPES.RUBRICLESS]: `<${RUBRIC_TAG_NAME} id="rubricless" />`,
  [RUBRIC_TYPES.MULTI_TRAIT_RUBRIC]: `<${MULTI_TRAIT_RUBRIC_TAG_NAME} id="multiTraitRubric" />`,
};

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
      case RUBRIC_TYPES.RUBRICLESS:
        customElements.whenDefined(RUBRIC_TAG_NAME).then(() => {
          this.setRubriclessModel(this.rubricless);
        });
        break;
    }

    if (oldType !== this.type) {
      this._render();
    }
  }

  setRubricModel(simpleRubric) {
    if (this._model && this._model.rubrics && this._model.rubrics.simpleRubric) {
      simpleRubric.model = preparePrintModel(this._model.rubrics.simpleRubric, this._options);
    }
  }

  setMultiTraitRubricModel(multiTraitRubric) {
    if (this._model && this._model.rubrics && this._model.rubrics.multiTraitRubric) {
      const { scales, excludeZero } = this._model.rubrics.multiTraitRubric || {};
      const parsedScales = (scales || []).map((scale) => ({ ...scale, excludeZero }));

      multiTraitRubric.model = {
        ...preparePrintModel(this._model.rubrics.multiTraitRubric, this._options),
        visible: true,
        arrowsDisabled: true,
        scales: parsedScales,
      };
    }
  }

  setRubriclessModel(rubricless) {
    if (this._model && this._model.rubrics && this._model.rubrics.rubricless) {
      rubricless.model = preparePrintModel(this._model.rubrics.rubricless, this._options);
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

  get rubricless() {
    return this.querySelector(`${RUBRIC_TAG_NAME}#rubricless`);
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    this.innerHTML = rubricTags[this._type] || '';
  }
}

export default ComplexRubricPrint;
