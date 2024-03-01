/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export async function model(question, session, env, updateSession) {
  const { role, mode } = env || {};

  question.showTeacherInstructions = !!(role === 'instructor' && (mode === 'view' || mode === 'evaluate'));

  return question;
}
