import defaults from './defaults';

export const createDefaultModel = (model = {}) => new Promise(resolve => resolve({ ...defaults, ...model }));

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 */
export async function model(question, session, env) {
  const normalizedQuestion = { ...defaults, ...question };

  const out = {
    ...normalizedQuestion,
    disabled: env.mode !== 'gather',
    mode: env.mode
  };

  const { role, mode } = env || {};

  if (role === 'instructor' && (mode === 'view' || mode === 'evaluate')) {
    out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
      ? normalizedQuestion.teacherInstructions
      : null;
  } else {
    out.teacherInstructions = null;
  }

  return out;
}

export const outcome = () => new Promise(resolve => resolve({ score: 0, empty: false }));
