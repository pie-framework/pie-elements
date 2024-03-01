/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 */
export async function model(question, session, env) {
  const { role, mode } = env || {};

  question.showTeacherInstructions = role === 'instructor' && (mode === 'view' || mode === 'evaluate');

  return question;
}
