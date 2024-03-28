import defaults from './defaults';

const prepareChoice = (choice) => {
  return {
    label: choice.label,
    value: choice.value,
  };
};

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

  let choices = normalizedQuestion.choices.map(prepareChoice);

  const out = {
    ...normalizedQuestion,
    choices,
    disabled: env.mode !== 'gather',
    mode: env.mode,
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
  return new Promise((resolve) => {
    resolve({ score: 0, empty: false });
  });
}

// remove all html tags
const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

// remove all html tags except img and iframe
const getContent = (html) => (html || '').replace(/(<(?!img|iframe)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const errors = {};

  ['teacherInstructions', 'prompt'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  return errors;
};
