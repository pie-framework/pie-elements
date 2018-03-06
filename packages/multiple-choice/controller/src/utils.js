import isEqual from 'lodash/isEqual';

export const getCorrectResponse = (choices) => choices
  .filter(c => c.correct)
  .map(c => c.value)
  .sort();

export const isResponseCorrect = (question, session) => {
  let correctResponse = getCorrectResponse(question.choices);
  return isEqual((session.value || []).sort(), correctResponse);
}