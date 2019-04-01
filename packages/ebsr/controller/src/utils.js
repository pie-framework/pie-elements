import isEqual from 'lodash/isEqual';

export const getCorrectResponse = (choices) => choices
  .filter(c => c.correct)
  .map(c => c.value)
  .sort();

export const isResponseCorrect = (question, key, session) => {
  let correctResponse = getCorrectResponse(question.choices);

  if (session.value) {
    return isEqual((session.value[key].value || []).sort(), correctResponse);
  }

  return false;
};
