import _ from 'lodash';
import { combination } from 'js-combinatorics';
import debug from 'debug';

const log = debug('pie-elements:placement-ordering:controller');

export const illegalArgumentError = answer =>
  new Error(
    `Cant score answer: ${answer} it has duplicates and allowDuplicates is false`
  );
export const pairwiseCombinationScore = (correct, answer, opts) => {
  opts = { allowDuplicates: false, orderMustBeComplete: false, ...opts };

  if (!opts.allowDuplicates && !_.isEqual(_.uniq(correct), correct)) {
    throw illegalArgumentError(answer);
  }

  if (
    opts.allowDuplicates === false &&
    answer.length !== _.uniq(answer).length
  ) {
    return 0;
  }

  answer = opts.allowDuplicates !== false ? answer : _.uniq(answer);

  log('answer:', answer);
  if (!Array.isArray(correct) || correct.length === 0) {
    throw new Error('correct must be non empty an array');
  }

  if (correct.length === 1) {
    return _.isEqual(correct, answer) ? 1 : 0;
  }

  if (!Array.isArray(answer) || answer.length < 2) {
    return 0;
  }

  if (answer.length > correct.length) {
    return 0;
  }

  if (correct.length !== answer.length && opts.orderMustBeComplete) {
    return 0;
  }

  const correctCombo = combination(correct, 2).toArray();
  const answerCombo = combination(answer, 2).toArray();

  const diff = _.differenceWith(answerCombo, correctCombo, _.isEqual);

  const comboLengthDiff = correctCombo.length - answerCombo.length;

  const total = correctCombo.length;
  const actual = total - diff.length - comboLengthDiff;

  const n = (actual / total).toFixed(2);

  return parseFloat(n);
};

/**
 * Flattens the correctResponse into an array of ordered identifiers representing the
 * correct response.
 */
export const flattenCorrect = question =>
  question.correctResponse.map(r => (r && r.id ? r.id : r));

/**
 * Returns all correct responses for this question
 * @param question - array
 */
export const getAllCorrectResponses = question => [
  flattenCorrect(question),
  ...(question.alternateResponses || [])
];

/**
 * Returns the score for a session. If weighted scoring is present in the correctResponse
 * field for the question, this will be used. If partial scoring is present in the question
 * model, this will be used. Otherwise the default scoring mechanism (0 for any incorrect, 1
 * for all correct) will be used.
 */

export const score = (question, session) => {
  const { value } = session || {};

  if (!value) {
    return 0;
  }

  const allCorrectResponse = getAllCorrectResponses(question);
  const allowDuplicates =
    (question.configure && question.configure.removeTilesAfterPlacing) !== false;

  /**
   * We require this to be the case - locking
   */
  //const orderMustBeComplete = true;

  let bestScore = 0;

  allCorrectResponse.forEach((cr) => {
    const currentScore = pairwiseCombinationScore(cr, value, {
      allowDuplicates
    });

    if (currentScore >= bestScore) {
      bestScore = currentScore;
    }
  });

  return bestScore;
};
