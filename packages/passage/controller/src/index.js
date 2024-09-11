import isEmpty from 'lodash/isEmpty';

import defaults from './defaults';

const getContent = (html) => (html || '').replace(/(<(?!img|iframe)([^>]+)>)/gi, '');

export function createDefaultModel(model = {}) {
  return new Promise((resolve) => {
    resolve({ ...defaults, ...model });
  });
}

export const normalize = (question) => ({ ...defaults, ...question });

const normalizeTeacherInstructions = (instructions, env) => {
  const { role, mode } = env;

  if (role === 'instructor' && (mode === 'view' || mode === 'evaluate')) {
    return instructions || '';
  }

  return '';
};

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 */
export async function model(question, session, env) {
  const normalizedQuestion = normalize(question);

  const normalizedPassages = normalizedQuestion.passages.map((passage, index) => ({
    teacherInstructions: normalizedQuestion.teacherInstructionsEnabled
      ? normalizeTeacherInstructions(passage.teacherInstructions, env)
      : '',
    label: getContent(passage.title) ? passage.title : `Passage ${index + 1}`,
    title: normalizedQuestion.titleEnabled ? passage.title || '' : '',
    subtitle: normalizedQuestion.subtitleEnabled ? passage.subtitle || '' : '',
    author: normalizedQuestion.authorEnabled ? passage.author || '' : '',
    text: normalizedQuestion.textEnabled ? passage.text || '' : '',
  }));

  return {
    ...normalizedQuestion,
    passages: normalizedPassages,
  };
}

export const validate = (model = {}, config = {}) => {
  const errors = {};
  const passagesErrors = {};

  (model.passages || []).forEach((passage, index) => {
    // validate only the first passage
    // TODO: remove when authoring is updated to support multiple passages
    if (index !== 0) {
      return;
    }

    const err = {};

    ['teacherInstructions', 'title', 'subtitle', 'author', 'text'].forEach((field) => {
      if (config[field]?.required && !getContent(passage[field])) {
        err[field] = 'This field is required.';
      }
    });

    if (!isEmpty(err)) {
      passagesErrors[index] = err;
    }
  });

  if (!isEmpty(passagesErrors)) {
    errors.passages = passagesErrors;
  }

  return errors;
};
