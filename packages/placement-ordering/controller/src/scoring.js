import _ from 'lodash';

export const maxScore = 1;

function defaultScore(question, session) {

  let allCorrect = _.isEqual(_.cloneDeep(session.value).sort(), _.cloneDeep(flattenCorrect(question)).sort());
  return allCorrect ? 1 : 0;
}

function partialScore(question, session) {
  let allCorrect = _.isEqual(_.cloneDeep(session.value).sort(), _.cloneDeep(flattenCorrect(question)).sort());
  let numCorrect = flattenCorrect(question).reduce((score, response, index) => {
    return (session.value[index] === response) ? score + 1 : score;
  }, 0);
  let weighting = question.partialScoring && question.partialScoring.find(({ correctCount }) => correctCount === numCorrect);
  return allCorrect ? maxScore : (weighting !== undefined && weighting.weight !== undefined) ? weighting.weight * maxScore : 0;
}

/**
 * Flattens the correctResponse into an array of ordered identifiers representing the
 * correct response. 
 */
export function flattenCorrect(question) {
  return question.correctResponse.find((response) => response instanceof Object) === undefined ? question.correctResponse :
    question.correctResponse.map(({ id }) => id);
}

/**
 * Returns the score for a session. If weighted scoring is present in the correctResponse
 * field for the question, this will be used. If partial scoring is present in the question
 * model, this will be used. Otherwise the default scoring mechanism (0 for any incorrect, 1
 * for all correct) will be used. 
 */
export function score(question, session) {
  /**
   * Note: weighted scoring has been removed for now - the existing component doesn't have it,* Can add it back when needed.
   */
  if (question.partialScoring !== undefined) {
    return partialScore(question, session);
  } else {
    return defaultScore(question, session);
  }
}