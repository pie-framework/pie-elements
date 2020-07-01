import defaults from './defaults';

const prepareChoice = choice => {
  return {
    label: choice.label,
    value: choice.value
  };
};

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

  let choices = normalizedQuestion.choices.map(prepareChoice);

  const out = {
    ...normalizedQuestion,
    choices,
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

export function outcome() {
  return new Promise(resolve => {
    resolve({ score: 0, empty: false });
  });
}
