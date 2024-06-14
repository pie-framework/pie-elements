import cloneDeep from 'lodash/cloneDeep';
import defaults from './defaults';

const getContent = (html) => (html || '').replace(/(<(?!img|iframe)([^>]+)>)/gi, '');

export function createDefaultModel(model = {}) {
  return new Promise((resolve) => {
    resolve({
      ...defaults,
      ...model,
    });
  });
}

export const normalize = (question) => ({
  ...defaults,
  ...question,
});
/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 */
export async function model(question, session, env) {
  const { role, mode } = env || {};
  const response = cloneDeep(question);

  response.showTeacherInstructions = role === 'instructor' && (mode === 'view' || mode === 'evaluate');

  // if we don't show the teacher instructions don't pass them on
  if (!response.showTeacherInstructions) {
    response.passages.forEach((passage) => {
      delete passage.teacherInstructions;
    });
  }

  return response;
}

export const validate = (model = {}, config = {}) => {
  const errors = {};

  ['teacherInstructions', 'title', 'subtitle', 'author', 'text'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  return errors;
};
