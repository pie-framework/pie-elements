import reduce from 'lodash/reduce';
import { isResponseCorrect } from './utils';
import { partialScoring } from '@pie-lib/controller-utils';

export function model(question, session, env) {
  return new Promise(resolve => {
    const feedback = env.mode !== 'evaluate'
      ? {}
      : question.choices.reduce((obj, c) => {
        if (session.value && question.correctResponse[c.id]) {
          obj[c.id] = session.value[c.id] === question.correctResponse[c.id];
        }

        return obj;
      }, {});

    const out = {
      ...question,
      feedback,
      mode: env.mode,
      disabled: env.mode !== 'gather',
      responseCorrect:
        env.mode === 'evaluate'
          ? isResponseCorrect(question, session)
          : undefined,
    };

    resolve(out);
  });
}

const getScore = (config, session) => {
  const maxScore = Object.keys(config.correctResponse).length;

  const correctCount = reduce(config.choices, (total, choice, key) => {
    const chosenValue = session.value && session.value[key];
    const correctValue = config.correctResponse[key];

    if (correctValue !== chosenValue) {
      return total - 1;
    }

    return total;
  }, maxScore);

  const str = (correctCount / maxScore).toFixed(2);

  return parseFloat(str, 10);
};

/**
 *
 * The score is partial by default for checkbox mode, allOrNothing for radio mode.
 * To disable partial scoring for checkbox mode you either set model.partialScoring = false or env.partialScoring =
 * false. the value in `env` will override the value in `model`.
 * @param {Object} model - the main model
 * @param {boolean} model.partialScoring - is partial scoring enabled (if undefined set to to true)
 * @param {*} session
 * @param {Object} env
 * @param {boolean} env.partialScoring - is partial scoring enabled (if undefined default to true) This overrides
 *   `model.partialScoring`.
 */
export function outcome(model, session, env) {
  return new Promise(resolve => {
    const partialScoringEnabled = partialScoring.enabled(model, env, false);
    const score = getScore(model, session);

    resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0 });
  });
}
