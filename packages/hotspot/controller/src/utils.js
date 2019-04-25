import isEqual from 'lodash/isEqual';

export const getCorrectResponse = (choices) => choices
  .filter(c => c.correct)
  .map(c => ({ id: c.id }))
  .sort();

export const isResponseCorrect = (question, session) => {
  let correctResponse = getCorrectResponse(question.shapes);

  if (session.answers.length) {
    return isEqual((session.answers || []).sort(), correctResponse);
  }
  return false;
};
