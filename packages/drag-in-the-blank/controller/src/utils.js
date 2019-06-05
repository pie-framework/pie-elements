import reduce from 'lodash/reduce';
import find from 'lodash/find';

export const isResponseCorrect = (question, session) => {
  if (!question || !session || !session.value) {
    return false;
  }

  return reduce(question.choices, (acc, area, key) => {
    if (!find(area, c => c === session.value[key])) {
      return false;
    }

    return acc;
  }, true);
};
