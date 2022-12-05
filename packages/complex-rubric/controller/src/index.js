import defaults from './defaults';
import { RUBRIC_TYPES } from '@pie-lib/rubric';

export function createDefaultModel(model = {}) {
  return new Promise((resolve) => resolve({ ...defaults.model, ...model }));
}

export const normalize = (question) => ({ ...defaults.model, ...question });

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 */
export async function model(question, session, env) {
  const normalizedQuestion = normalize(question);

  if (normalizedQuestion.rubricType === RUBRIC_TYPES.SIMPLE_RUBRIC) {
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
export function outcome(model, session, env) {
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
