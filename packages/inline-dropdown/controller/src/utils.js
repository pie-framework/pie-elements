import isEqual from 'lodash/isEqual';
import reduce from 'lodash/reduce';
import find from 'lodash/find';

export const isResponseCorrect = (question, session) => {
  if (!question || !session || !session.value) {
    return false;
  }

  let correctResponse = reduce(question.choices, (acc, area, key) => {
    const correctChoice = find(area, c => c.correct);

    acc[key] = correctChoice.value;

    return acc;
  }, {});

  return isEqual((session.value || {}), correctResponse);
};
