import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import React from 'react';
import ReactDOM from 'react-dom';
import RubricConfigure from '@pie-element/rubric/configure/lib';
import MultiTraitRubricConfigure from '@pie-element/multi-trait-rubric/configure/lib';
import debug from 'debug';
import defaults from 'lodash/defaults';
import Main from './main';
import sensibleDefaults from './defaults';

const MODEL_UPDATED = ModelUpdatedEvent.TYPE;
const RUBRIC_TAG_NAME = 'rubric-configure';
const MULTI_TRAIT_RUBRIC_TAG_NAME = 'multi-trait-rubric-configure';

class ComplexSimpleRubricConfigure extends RubricConfigure {}

class ComplexMTRConfigure extends MultiTraitRubricConfigure {
}

const defineComplexRubric = () => {
  if (!customElements.get(RUBRIC_TAG_NAME)) {
    customElements.define(RUBRIC_TAG_NAME, ComplexSimpleRubricConfigure);
  }
  if (!customElements.get(MULTI_TRAIT_RUBRIC_TAG_NAME)) {
    customElements.define(MULTI_TRAIT_RUBRIC_TAG_NAME, ComplexMTRConfigure);
  }
};

defineComplexRubric();

const prepareCustomizationObject = (config, model) => {
  const configuration = defaults(config, sensibleDefaults.configuration);

  return {
    configuration,
    model,
  };
};

export default class ComplexRubricConfigureElement extends HTMLElement {
  static createDefaultModel = (
    {
      rubrics: { simpleRubric = {}, rubricless = {}, multiTraitRubric = {} } = { simpleRubric: {}, rubricless: {}, multiTraitRubric: {} },
      ...model
    } = {},
    currentModel = {},
  ) =>
  {
    const pieDefaults = sensibleDefaults?.model || {}
    return {
      ...pieDefaults,
      ...currentModel,
      ...model,
    rubrics: {
      simpleRubric: {
        ...(sensibleDefaults?.model?.rubrics || {}).simpleRubric,
        ...(currentModel.rubrics || {}).simpleRubric,
        ...simpleRubric,
      },
      multiTraitRubric: {
        ...(sensibleDefaults?.model?.rubrics || {}).multiTraitRubric,
        ...(currentModel.rubrics || {}).multiTraitRubric,
        ...multiTraitRubric,
      },
      rubricless: {
        ...(sensibleDefaults?.model?.rubrics || {}).rubricless,
        ...(currentModel.rubrics || {}).rubricless,
        ...rubricless,
      },
    },
  }};

  constructor() {
    super();
    this.canUpdateModel = false;

    debug.log('constructor called');

    this._model = ComplexRubricConfigureElement.createDefaultModel();
    this._configuration = sensibleDefaults.configuration;

    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  set model(m) {
    this._model = ComplexRubricConfigureElement.createDefaultModel(m, this._model);

    this.canUpdateModel = true;
    this._render();
  }

  dispatchModelUpdated(reset) {
    const resetValue = !!reset;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, resetValue));
  }

  onModelChanged = (m, reset) => {
    this._model = ComplexRubricConfigureElement.createDefaultModel(m, this._model);

    this.dispatchModelUpdated(reset);

    this._render();
  };

  set configuration(c) {
    const info = prepareCustomizationObject(c, this._model);
    this._configuration = info.configuration;

    this._render();
  }

  onConfigurationChanged(c) {
    this._configuration = prepareCustomizationObject(c, this._model).configuration;

    if (this._model) {
      this.onModelChanged(this._model);
    }

    this._render();
  }

  onModelUpdated = (e) => {
    if (e.target === this) {
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    const id = e.target && e.target.getAttribute('id');

    if (id) {
      if (e.update) {
        this._model.rubrics[id] = e.update;
      }

      this.dispatchEvent(new ModelUpdatedEvent(this._model));
    }
  };

  connectedCallback() {
    this.addEventListener(MODEL_UPDATED, this.onModelUpdated);
    this._render();
  }

  disconnectedCallback() {
    this.removeEventListener(MODEL_UPDATED, this.onModelUpdated);
  }

  _render() {
    let element = React.createElement(Main, {
      model: this._model,
      configuration: this._configuration,
      onModelChanged: this.onModelChanged,
      onConfigurationChanged: this.onConfigurationChanged,
      canUpdateModel: this.canUpdateModel
    });

    ReactDOM.render(element, this);
  }
}
