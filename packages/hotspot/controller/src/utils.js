import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

export const getCorrectResponse = (choices) => choices
  .filter(c => c.correct)
  .map(c => ({ id: c.id }))
  .sort();

export const isResponseCorrect = (question, session) => {
  const { shapes: { rectangles, polygons } } = question;
  const choices = [...rectangles, ...polygons];
  let correctResponse = getCorrectResponse(choices);

  if (!session || isEmpty(session)) {
    return false;
  }

  if (session.answers && session.answers.length) {
    return isEqual((session.answers || []).sort(), correctResponse);
  } else if (!(correctResponse && correctResponse.length)) {
    return true;
  }
  return false;
};
