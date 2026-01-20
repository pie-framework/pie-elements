import {
  ModelUpdatedEvent,
  InsertSoundEvent,
  DeleteSoundEvent,
  InsertImageEvent,
  DeleteImageEvent,
} from '@pie-framework/pie-configure-events';

import React from 'react';
import { createRoot } from 'react-dom/client';

import Main from './main';
import defaults from './defaults';
import { addOrRemoveScaleColumn } from './utils';
import { excludeZeroTypes } from './modals';

const modelWithDefaults = (m) => ({ ...defaults.model, ...m });
const configurationWithDefaults = (c) => ({ ...defaults.configuration, ...c });

export default class MultiTraitRubricElement extends HTMLElement {
  constructor() {
    super();
    this._root = null;
    this._model = modelWithDefaults();
    this._configuration = configurationWithDefaults();
  }

  updateModelAccordingToReceivedProps = (m) => {
    const currentModel = { ...this._model };

    if (!m) {
      return currentModel;
    }

    const validatedModel = { ...m };
    const { scales, excludeZero } = validatedModel || {};

    (scales || []).forEach((scale) => {
      if (!scale) {
        scale = { scorePointsLabels: [], traits: [] };
      }

      const { maxPoints } = scale || {};

      scale.scorePointsLabels = [...(scale.scorePointsLabels || [])];
      scale.traits = [...(scale.traits || [])];

      const howManyScorePointLabelsShouldHave = excludeZero ? maxPoints : maxPoints + 1;
      const howManyScorePointLabelsItHas = scale.scorePointsLabels.length;

      if (howManyScorePointLabelsItHas !== howManyScorePointLabelsShouldHave) {
        if (howManyScorePointLabelsItHas < howManyScorePointLabelsShouldHave) {
          for (let i = 0; i < howManyScorePointLabelsShouldHave - howManyScorePointLabelsItHas; i++) {
            scale.scorePointsLabels.push('');
          }
        } else {
          scale.scorePointsLabels = scale.scorePointsLabels.slice(0, howManyScorePointLabelsShouldHave);
        }
      }

      (scale.traits || []).forEach((trait) => {
        if (!trait) {
          trait = { scorePointsDescriptors: [] };
        }

        trait.scorePointsDescriptors = [...(trait.scorePointsDescriptors || [])];

        const howManyScorePointDescriptorsItHas = trait.scorePointsDescriptors.length;

        if (howManyScorePointDescriptorsItHas !== howManyScorePointLabelsShouldHave) {
          if (howManyScorePointDescriptorsItHas < howManyScorePointLabelsShouldHave) {
            for (let i = 0; i < howManyScorePointLabelsShouldHave - howManyScorePointDescriptorsItHas; i++) {
              trait.scorePointsDescriptors.push('');
            }
          } else {
            trait.scorePointsDescriptors = trait.scorePointsDescriptors.slice(0, howManyScorePointLabelsShouldHave);
          }
        }
      });
    });

    if (validatedModel.excludeZero) {
      // check if any scale has maxPoints set to 1
      const shouldAddColumn0 = validatedModel.scales.some((scale) => scale.maxPoints === 1);

      if (shouldAddColumn0) {
        // excludeZero should be false and disabled when maxPoints is 1
        validatedModel.excludeZero = false;
        // add column 0 for all scales
        validatedModel.scales = addOrRemoveScaleColumn(scales, excludeZeroTypes.add0);
      }
    }

    return validatedModel;
  };

  set model(m) {
    this._model = this.updateModelAccordingToReceivedProps(modelWithDefaults(m));
    this._render();
  }

  set configuration(c) {
    this._configuration = configurationWithDefaults(c);
    this._render();
  }

  onModelChanged = (m) => {
    this._model = this.updateModelAccordingToReceivedProps(modelWithDefaults(m));
    this._render();
    this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
  };

  onConfigurationChanged = (c) => {
    this._configuration = configurationWithDefaults(c);

    this._render();
  };

  insertSound(handler) {
    this.dispatchEvent(new InsertSoundEvent(handler));
  }

  onDeleteSound(src, done) {
    this.dispatchEvent(new DeleteSoundEvent(src, done));
  }

  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  _render() {
    if (this._model) {
      let element = React.createElement(Main, {
        model: this._model,
        configuration: this._configuration,
        onModelChanged: this.onModelChanged,
        onConfigurationChanged: this.onConfigurationChanged,
        uploadSoundSupport: {
          add: this.insertSound.bind(this),
          delete: this.onDeleteSound.bind(this),
        },
        imageSupport: {
          add: this.insertImage.bind(this),
          delete: this.onDeleteImage.bind(this),
        },
      });

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(element);
    }
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
