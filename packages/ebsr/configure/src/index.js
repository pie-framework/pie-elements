import { ModelUpdatedEvent } from '@pie-framework/pie-configure-events';
import MultipleChoiceConfigure from '@pie-element/multiple-choice/configure/lib';
import defaults from 'lodash/defaults';
import cloneDeep from 'lodash/cloneDeep';

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
    this.onConfigurationChanged = this.onConfigurationChanged.bind(this);
  }

  populatePart(config, id) {
    const isFirst= id === 'a';
    const labelEl = document.getElementById(`${isFirst ? 'first' : 'second'}_label_config`);
    let labelVal;

    if (config.partLabels && !config.partLabels.enabled) {
      labelVal = ''
    } else {
      const type = config.partLabelType || 'Numbers';
      const typeIsNumber = type === 'Numbers';

      if (isFirst) {
        labelVal = `Part ${typeIsNumber ? '1' : 'A'}`;
      } else {
        labelVal = `Part ${typeIsNumber ? '2' : 'B'}`;
      }
    }
    if (this._model) {
      this._model[`part${id.toUpperCase()}`].partLabel = labelVal;
      this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
    }
    labelEl.innerHTML = labelVal;
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
    const isPartA = part === 'partA';
    this._configuration = prepareCustomizationObject(c, this._model).configuration;
    this.populatePart(c, isPartA ? 'a' : 'b');
    this[part].configuration = {
      ...this._configuration,
      ...isPartA === 'partA' ? { ...partADesignConfiguration } : {},
    };

    if (this._model) {
      this._model[part].allowFeedback = (c.feedback || {}).enabled;

      this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
    }
  }

  set model(m) {
    this._model = m;

    if (this.partA) {
      this.partA.onConfigurationChanged = (c) => this.onConfigurationChanged(c, 'partA');
    }

    if (this.partB) {
      this.partB.onConfigurationChanged = (c) => this.onConfigurationChanged(c, 'partB');
    }

    customElements.whenDefined(MC_TAG_NAME).then(() => {
      if (this.partA) {
        this.partA.model = this._model.partA;
        this.partA.configuration = {
          ...cloneDeep(this._configuration),
          ...partADesignConfiguration
        };
        this.populatePart(this.partA._configuration, 'a');
      }

      if (this.partB) {
        this.partB.model = this._model.partB;
        this.partB.configuration = {
          ...cloneDeep(this._configuration)
        };
        this.populatePart(this.partB._configuration, 'b');
      }
    });
  }

  set configuration(c) {
    customElements.whenDefined(MC_TAG_NAME).then(() => {
      const info = prepareCustomizationObject(c, this._model);

      if (this.partA) {
        this.partA.configuration = {
          ...info.configuration,
          ...partADesignConfiguration
        };
      }

      if (this.partB) {
        this.partB.configuration = info.configuration;
      }

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
        <p id="first_label_config"></p>
        <${MC_TAG_NAME} id="a"></${MC_TAG_NAME}>
        <p id="second_label_config"></p>
        <${MC_TAG_NAME} id="b"></${MC_TAG_NAME}>
      </div>
    `;
  }
}
