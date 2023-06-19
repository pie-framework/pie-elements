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
  const { scales } = model;
  const errors = {};
  const traitsErrors = {};

  (scales || []).forEach((scale, scaleIndex) => {
    const { traits = [] } = scale;
    const scaleErrors = {};
    traits.forEach((trait, traitIndex) => {
      if(!trait.name || trait.name === '<div></div>') {
        scaleErrors[traitIndex] = 'Trait names should not be empty.';
      }
      else{
        const identicalTraitName = traits.slice(traitIndex + 1).some(t => this.markupToText(t.name) === this.markupToText(trait.name));

        if (identicalTraitName) {
          scaleErrors[traitIndex] = 'Trait names should be unique.';
        }
      }
    });
    if(Object.keys(scaleErrors).length > 0){
      traitsErrors[scaleIndex]=scaleErrors;
    }
  });
  if(Object.keys(traitsErrors).length > 0){
    errors.traitsErrors = traitsErrors;
  }

  return errors;
};
