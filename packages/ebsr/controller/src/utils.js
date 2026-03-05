import { isEqual } from 'lodash-es';

export const getCorrectResponse = (choices) =>
  choices &&
  choices
    .filter((c) => c.correct)
    .map((c) => c.value)
    .sort();

export const isResponseCorrect = (question, key, session) => {
  let correctResponse = getCorrectResponse(question.choices);

  if (session && session.value) {
    return isEqual((session.value[key].value || []).sort(), correctResponse);
  }

  return false;
};
