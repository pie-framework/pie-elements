import cloneDeep from 'lodash/cloneDeep';

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
