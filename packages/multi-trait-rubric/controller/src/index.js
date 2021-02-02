import defaults from './defaults';

export function createDefaultModel(model = {}) {
  return new Promise(resolve => resolve({ ...defaults, ...model }));
}

export const normalize = question => ({ ...defaults, ...question });

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

  return normalizedQuestion;
}


export const getScore = () => 0;

/**
 * @param {Object} model - the main model
 * @param {*} session
 * @param {Object} env
 */
export function outcome(model, session, env) {
  return new Promise(resolve => resolve({ score: 0, empty: true }));
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      resolve({ id: '1' });
    } else {
      resolve(null);
    }
  });
};
