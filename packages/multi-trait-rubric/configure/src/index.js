import { ModelUpdatedEvent, InsertSoundEvent, DeleteSoundEvent } from '@pie-framework/pie-configure-events';

import React from 'react';
import ReactDOM from 'react-dom';

import Main from './main';
import defaults from './defaults';

const modelWithDefaults = (m) => ({ ...defaults.model, ...m });
const configurationWithDefaults = (c) => ({ ...defaults.configuration, ...c });

export default class MultiTraitRubricElement extends HTMLElement {
  constructor() {
    super();
    this._model = modelWithDefaults();
    this._configuration = configurationWithDefaults();
  }

  updateModelAccordingToReceivedProps = (m) => {
    if (!m) {
      return { ...defaults.model };
    }

    const validatedModel = { ...m };
    const { scales, excludeZero } = validatedModel;

    (scales || []).forEach(scale => {
      if (!scale) return;

      const { maxPoints } = scale || {};

      scale.scorePointsLabels = [ ...(scale.scorePointsLabels || []) ];
      scale.traits = [ ...(scale.traits || []) ];

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

      (scale.traits || []).forEach(trait => {
        if (!trait) return;

        trait.scorePointsDescriptors = [ ...(trait.scorePointsDescriptors || []) ];

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

    return validatedModel;
  };

  set model(m) {
    this._model = this.validateModel(modelWithDefaults(m));
    this._render();
  }

  set configuration(c) {
    this._configuration = configurationWithDefaults(c);
    this._render();
  }

  onModelChanged = (m) => {
    this._model = this.validateModel(modelWithDefaults(m));
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

  _render() {
    console.log('THE MODEL', this._model);
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
      });

      ReactDOM.render(element, this);
    }
  }
}
