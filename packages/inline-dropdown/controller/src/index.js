import shuffle from 'lodash/shuffle';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import { isResponseCorrect } from './utils';
import { partialScoring } from '@pie-lib/controller-utils';

const prepareChoice = (mode, defaultFeedback) => choice => {
  const out = {
    label: choice.label,
    value: choice.value
  };

  if (mode === 'evaluate') {
    out.correct = !!choice.correct;

    const feedbackType = (choice.feedback && choice.feedback.type) || 'none';

    if (feedbackType === 'default') {
      out.feedback = defaultFeedback[choice.correct ? 'correct' : 'incorrect'];
    } else if (feedbackType === 'custom') {
      out.feedback = choice.feedback.value;
    }
  }

  return out;
};

export function model(question, session, env) {
  return new Promise(resolve => {
    const defaultFeedback = Object.assign(
      { correct: 'Correct', incorrect: 'Incorrect' },
      question.defaultFeedback
    );
    const preparChoiceFn = prepareChoice(env.mode, defaultFeedback);

    let choices = reduce(question.choices, (obj, area, key) => {
      obj[key] = map(area, preparChoiceFn);

      return obj;
    }, {});

    if (!question.lockChoiceOrder) {
      // eslint-disable-next-line no-console
      console.error(
        '!!! Warning - shuffling the model every time is bad, it should be stored in the session. see: https://app.clubhouse.io/keydatasystems/story/131/config-ui-support-shuffle-choices'
      );
      choices = reduce(question.choices, (obj, area, key) => {
        obj[key] = shuffle(area);

        return obj;
      }, {});
    }

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      prompt: question.prompt,
      shuffle: !question.lockChoiceOrder,
      markup: question.markup,
      choices,

      responseCorrect:
        env.mode === 'evaluate'
          ? isResponseCorrect(question, session)
          : undefined,
    };

    resolve(out);
  });
}

const isCorrect = c => c.correct === true;

const getScore = (config, session) => {
  const maxScore = Object.keys(config.choices).length;

  const correctCount = reduce(config.choices, (total, respArea, key) => {
    const chosenValue = session.value[key];
    const correctChoice = find(respArea, c => isCorrect(c));
    const correctAlternate = config.alternateResponse &&
      config.alternateResponse[key] &&
      find(config.alternateResponse[key], id => id === chosenValue);

    if (correctChoice.value !== chosenValue && !correctAlternate) {
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
