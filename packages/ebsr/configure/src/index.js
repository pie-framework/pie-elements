import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';
import defaults from 'lodash/defaults';

import sensibleDefaults from './defaults';

const MODEL_UPDATED = ModelUpdatedEvent.TYPE;
const MC_TAG_NAME = 'ebsr-multiple-choice-configure';

class EbsrMCConfigure extends MultipleChoiceConfigure {}

const defineMultipleChoice = () => {
  if (!customElements.get(MC_TAG_NAME)) {
    customElements.define(MC_TAG_NAME, EbsrMCConfigure);
  }
};

defineMultipleChoice();

const prepareCustomizationObject = (config, model) => {
  const configuration = defaults(config, sensibleDefaults.configuration);

  return {
    configuration,
    model
  };
};
// partA is designed to be single choice so partial scoring is not allowed.
const partADesignConfiguration = {
  choiceMode: {
    settings: false,
    label: 'Response Type'
  },
  partialScoring: {
    settings: false,
    label: 'Allow Partial Scoring'
  }
};

export default class EbsrConfigure extends HTMLElement {
  static createDefaultModel = (model = {}) => ({
    ...sensibleDefaults,
    ...model
  });

  constructor() {
    super();
    this._model = EbsrConfigure.createDefaultModel();
    this._configuration = sensibleDefaults.configuration;
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

  onConfigurationChanged(c, part) {
    this._configuration = prepareCustomizationObject(c, this._model).configuration;
    this[part].configuration = {
      ...this._configuration,
      ...part === 'partA' ? { ...partADesignConfiguration } : {},
    };

    if (this._model) {
      this._model[part].allowFeedback = (c.feedback || {}).enabled;
      this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
    }
    this._render();
  }

  set model(m) {
    this._model = m;

    customElements.whenDefined(MC_TAG_NAME).then(() => {
      this.partA.model = this._model.partA;
      this.partA.configuration = {
        ...this._configuration,
        ...partADesignConfiguration
      };
      this.partA.onConfigurationChanged = (c) => this.onConfigurationChanged(c, 'partA');

      this.partB.model = this._model.partB;
      this.partB.configuration = {
        ...this._configuration,
      };
      this.partB.onConfigurationChanged = (c) => this.onConfigurationChanged(c, 'partB');
    });
  }

  set configuration(c) {
    customElements.whenDefined(MC_TAG_NAME).then(() => {
      const info = prepareCustomizationObject(c, this._model);

      this.partA.configuration = {
        ...info.configuration,
        ...partADesignConfiguration
      };
      this.partB.configuration = info.configuration;
      this._configuration = info.configuration;
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
