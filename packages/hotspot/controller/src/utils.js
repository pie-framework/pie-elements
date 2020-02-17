import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

export const getCorrectResponse = (choices) => choices
  .filter(c => c.correct)
  .map(c => c.id)
  .sort();

export const isResponseCorrect = (question, session) => {
  const { shapes: { rectangles, polygons } } = question;
  const choices = [...rectangles, ...polygons];
  let correctResponseIds = getCorrectResponse(choices);

  if (!session || isEmpty(session)) {
    return false;
  }

  if (session.answers && session.answers.length) {
    let answerIds = (session.answers || []).map(a => a.id);

    return isEqual(answerIds.sort(), correctResponseIds);
  } else if (!(correctResponseIds && correctResponseIds.length)) {
    return true;
  }

  return false;
};
