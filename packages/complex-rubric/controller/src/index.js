import defaults from './defaults';
import { markupToText } from './utils';


// todo the import from pie-lib/rubric WILL break pslb
//  so don't use it unless you also test "yarn build"
const RUBRIC_TYPES = {
  SIMPLE_RUBRIC: 'simpleRubric',
  MULTI_TRAIT_RUBRIC: 'multiTraitRubric',
  'rubricless': 'rubricless',
};

export function createDefaultModel(model = {}) {
  return new Promise((resolve) => resolve({ ...defaults, ...model }));
}

export const normalize = (question) => ({ ...defaults, ...question });

/**
 * @param {*} question
 * @param {*} session
 * @param {*} env
 */
export async function model(question, session, env) {
  const normalizedQuestion = normalize(question);

  if (
    normalizedQuestion.rubricType === RUBRIC_TYPES.SIMPLE_RUBRIC ||
    normalizedQuestion.rubricType === RUBRIC_TYPES.RUBRICLESS
  ) {
    return new Promise((resolve) => {
      resolve(
        env && env.role && env.role === 'instructor'
          ? {
              ...normalizedQuestion,
              rubrics: {
                ...normalizedQuestion.rubrics,
                multiTraitRubric: {
                  ...normalizedQuestion.rubrics.multiTraitRubric,
                  visible: false,
                },
              },
            }
          : {},
      );
    });
  } else {
    if (
      !env.role ||
      (env.role === 'student' && normalizedQuestion.rubrics && normalizedQuestion.rubrics.multiTraitRubric)
    ) {
      normalizedQuestion.rubrics.multiTraitRubric.visible = normalizedQuestion.visibleToStudent;
    } else {
      normalizedQuestion.rubrics.multiTraitRubric.visible = true;
    }

    // todo update pie-ui instead of parsing this here:
    const { scales, excludeZero } = normalizedQuestion.rubrics.multiTraitRubric || {};
    const parsedScales = (scales || []).map((scale) => ({ ...scale, excludeZero }));

    return {
      ...normalizedQuestion,
      rubrics: {
        ...normalizedQuestion.rubrics,
        simpleRubric: {
          ...normalizedQuestion.rubrics.simpleRubric,
          visible: false,
        },
        rubricless: {
          ...normalizedQuestion.rubrics.rubricless,
          visible: false,
        },
        multiTraitRubric: {
          ...normalizedQuestion.rubrics.multiTraitRubric,
          scales: parsedScales,
        },
      },
    };
  }
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

// IMPORTANT! This function is a duplicate of rubric/controller/validate function!
// If you make any changes to this function, please make sure you also update rubric/controller/validate function!“.
const validateSimpleRubric = (model) => {
  const { points } = model;
  const errors = {};
  const pointsDescriptorsErrors = {};

  (points || []).forEach((point, index) => {

    if (!point || point === '<div></div>') {
      pointsDescriptorsErrors[index] = 'Points descriptors cannot be empty.';
    } else {
      const identicalPointDescr = points.slice(index + 1).some((p) => markupToText(p) === markupToText(point));

      if (identicalPointDescr) {
        pointsDescriptorsErrors[index] = 'Points descriptors should be unique.';
      }
    }
  });

  if (Object.keys(pointsDescriptorsErrors).length > 0) {
    errors.pointsDescriptorsErrors = pointsDescriptorsErrors;
  }

  return errors;
};

// IMPORTANT! This function is a duplicate of multi-trait-rubric/controller/validate function!
// If you make any changes to this function, please make sure you also update multi-trait-rubric/controller/validate function!“.
const validateMultiTraitRubric = (model) => {
  const { scales, description = false, pointLabels = false } = model;
  const errors = {};
  const traitsErrors = {};
  const scorePointsErrors = {};

  (scales || []).forEach((scale, scaleIndex) => {
    const { traits = [] } = scale;
    const { scorePointsLabels = [] } = scale;
    const scaleErrors = {};
    const scorePointsLabelsErrors = {};

    if (pointLabels) {
      scorePointsLabels.forEach((scorePointLabel, scoreIndex) => {
        if (!scorePointLabel || scorePointLabel === '<div></div>') {
          scorePointsLabelsErrors[scoreIndex] = 'Points labels should not be empty.';
        } else {
          const identicalScorePointLabel = scorePointsLabels
            .slice(scoreIndex + 1)
            .some((s) => markupToText(s) === markupToText(scorePointLabel));

          if (identicalScorePointLabel) {
            scorePointsLabelsErrors[scoreIndex] = 'Points labels should be unique.';
          }
        }
      });
    }

    if (Object.keys(scorePointsLabelsErrors).length > 0) {
      scorePointsErrors[scaleIndex] = scorePointsLabelsErrors;
    }

    traits.forEach((trait, traitIndex) => {
      if (!trait.name || trait.name === '<div></div>') {
        scaleErrors[traitIndex] = { name: 'Trait names should not be empty.' };
      } else {
        const identicalTraitName = traits
          .slice(traitIndex + 1)
          .some((t) => markupToText(t.name) === markupToText(trait.name));

        if (identicalTraitName) {
          scaleErrors[traitIndex] = { name: 'Trait names should be unique.' };
        }
      }
      if (description && (!trait.description || trait.description === '<div></div>')) {
        scaleErrors[traitIndex] = { ...scaleErrors[traitIndex], description: 'Trait description should not be empty' };
      } else {
        const identicalTraitDescr = traits
          .slice(traitIndex + 1)
          .some((t) => markupToText(t.description) === markupToText(trait.description));

        if (description && identicalTraitDescr) {
          scaleErrors[traitIndex] = { ...scaleErrors[traitIndex], description: 'Trait descriptions should be unique.' };
        }
      }
    });
    if (Object.keys(scaleErrors).length > 0) {
      traitsErrors[scaleIndex] = scaleErrors;
    }
  });

  if (Object.keys(traitsErrors).length > 0) {
    errors.traitsErrors = traitsErrors;
  }

  if (Object.keys(scorePointsErrors).length > 0) {
    errors.scorePointsErrors = scorePointsErrors;
  }

  return errors;
};

export const validate = (model = {}, config = {}) => {
  const { rubrics = {}, rubricType } = model;
  const { multiTraitRubric = {}, simpleRubric = {} } = rubrics;
  let errors = {};

  switch (rubricType) {
    case RUBRIC_TYPES.SIMPLE_RUBRIC:
    default:
      errors = validateSimpleRubric(simpleRubric);
      break;
    case RUBRIC_TYPES.MULTI_TRAIT_RUBRIC:
      errors = validateMultiTraitRubric(multiTraitRubric);
      break;
  }

  return errors;
};
