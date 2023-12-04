import defaults from './defaults';
import { markupToText } from './utils';

export function createDefaultModel(model = {}) {
  return new Promise((resolve) => resolve({ ...defaults, ...model }));
}

export const normalize = (question) => ({ ...defaults, ...question });

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 */
export async function model(question, session, env) {
  const normalizedQuestion = normalize(question);

  if (!env.role || env.role === 'student') {
    normalizedQuestion.visible = normalizedQuestion.visibleToStudent;
  } else {
    normalizedQuestion.visible = true;
  }

  // todo update pie-ui instead of parsing this here:
  const { scales, excludeZero } = normalizedQuestion || {};
  const parsedScales = (scales || []).map((scale) => ({ ...scale, excludeZero }));

  return {
    ...normalizedQuestion,
    scales: parsedScales,
  };
}

export const getScore = () => 0;

/**
 * @param {Object} model - the main model
 * @param {*} session
 * @param {Object} env
 */
export function outcome() {
  return new Promise((resolve) => resolve({ score: 0, empty: true }));
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      resolve({ id: '1' });
    } else {
      resolve(null);
    }
  });
};


export const validate  = (model, config) => {
  const { scales, description = false, pointLabels = false } = model;
  const errors = {};
  const traitsErrors = {};
  const scorePointsErrors = {};

  (scales || []).forEach((scale, scaleIndex) => {
    const { traits = [] } = scale;
    const { scorePointsLabels = [] } = scale;
    const scaleErrors = {};
    const scorePointsLabelsErrors = {};

    if(pointLabels) {
      scorePointsLabels.forEach((scorePointLabel, scoreIndex) => {
        if (!scorePointLabel || scorePointLabel === '<div></div>') {
          scorePointsLabelsErrors[scoreIndex] = 'Points labels should not be empty.';
        } else {
          const identicalScorePointLabel = scorePointsLabels.slice(scoreIndex + 1).some(s => this.markupToText(s) === this.markupToText(scorePointLabel));

          if (identicalScorePointLabel) {
            scorePointsLabelsErrors[scoreIndex] = 'Points labels should be unique.';
          }
        }
      })
    }

    if(Object.keys(scorePointsLabelsErrors).length > 0){
      scorePointsErrors[scaleIndex] = scorePointsLabelsErrors;
    }

    traits.forEach((trait, traitIndex) => {
      if(!trait.name || trait.name === '<div></div>') {
        scaleErrors[traitIndex] = {name: 'Trait names should not be empty.'};
      }
      else{
        const identicalTraitName = traits.slice(traitIndex + 1).some(t => markupToText(t.name) === markupToText(trait.name));

        if (identicalTraitName) {
          scaleErrors[traitIndex] = {name: 'Trait names should be unique.'};
        }
      }
      if(description && (!trait.description || trait.description === '<div></div>')) {
        scaleErrors[traitIndex] = {... scaleErrors[traitIndex], description: 'Trait description should not be empty'};
      }
      else{
        const identicalTraitDescr = traits.slice(traitIndex + 1).some(t => markupToText(t.description) === markupToText(trait.description));

        if (description && identicalTraitDescr) {
          scaleErrors[traitIndex] = {... scaleErrors[traitIndex], description: 'Trait descriptions should be unique.'};
        }
      }

    });
    if(Object.keys(scaleErrors).length > 0){
      traitsErrors[scaleIndex] = scaleErrors;
    }
  });

  if(Object.keys(traitsErrors).length > 0){
    errors.traitsErrors = traitsErrors;
  }

  if(Object.keys(scorePointsErrors).length > 0){
    errors.scorePointsErrors = scorePointsErrors;
  }

  return errors;
};
