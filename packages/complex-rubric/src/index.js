import Rubric from '@pie-element/rubric';
import MultiTraitRubric from '@pie-element/multi-trait-rubric';
import { RUBRIC_TYPES } from '@pie-lib/pie-toolbox/rubric';

const RUBRIC_TAG_NAME = 'complex-rubric-simple';
const MULTI_TRAIT_RUBRIC_TAG_NAME = 'complex-rubric-multi-trait';

class ComplexRubricSimple extends Rubric {
}

class ComplexRubricMultiTrait extends MultiTraitRubric {
}

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

  setRubriclessModel(rubricless) {
    if (this._model && this._model.rubrics && this._model.rubrics.rubricless) {
      const { mode } = this._model;

      rubricless.model = {
        ...this._model.rubrics.rubricless,
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

  get rubricless() {
    return this.querySelector(`${RUBRIC_TAG_NAME}#rubricless`);
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    let rubricTag;
    if (this._type === RUBRIC_TYPES.SIMPLE_RUBRIC) {
      rubricTag = `<${RUBRIC_TAG_NAME} id="simpleRubric" />`
    }
    else if (this._type === RUBRIC_TYPES.RUBRICLESS){
      rubricTag = `<${RUBRIC_TAG_NAME} id="rubricless" />`;
    }
    else{
      rubricTag = `<${MULTI_TRAIT_RUBRIC_TAG_NAME} id="multiTraitRubric" />`;
    }

    this.innerHTML = rubricTag;

    // when item is re-rendered (due to connectedCallback), if the custom element is already defined,
    // we need to set the model and session, otherwise the setters are not reached again
    switch (this._type) {
      case RUBRIC_TYPES.SIMPLE_RUBRIC:
      default:
        if (customElements.get(RUBRIC_TAG_NAME)) {
          this.setRubricModel(this.simpleRubric);
        }
        break;
      case RUBRIC_TYPES.MULTI_TRAIT_RUBRIC:
        if (customElements.get(MULTI_TRAIT_RUBRIC_TAG_NAME)) {
          this.setMultiTraitRubricModel(this.multiTraitRubric);
        }
        break;
      case RUBRIC_TYPES.RUBRICLESS:
        if (customElements.get(RUBRIC_TAG_NAME)) {
          this.setRubriclessModel(this.rubricless);
        }
        break;

    }
  }
}

export default ComplexRubric;
