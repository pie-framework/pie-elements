import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import { isResponseCorrect } from './utils';
import { partialScoring } from '@pie-lib/controller-utils';

const prepareChoice = (mode, defaultFeedback) => choice => {
  const out = {
    label: choice.label,
    id: choice.id
  };

  if (mode === 'evaluate') {
    out.correct = true;

    const feedbackType = (choice.feedback && choice.feedback.type) || 'none';

    if (feedbackType === 'default') {
      out.feedback = defaultFeedback['correct'];
    } else if (feedbackType === 'custom') {
      out.feedback = choice.feedback.value;
    }
  }

  return out;
};

const getFeedback = (answers, choices, key) => {
  const answer = answers[key];
  const result = find(choices, c => prepareVal(c.label) === prepareVal(answer));

  if (result) {
    return 'correct';
  }

  return 'incorrect';
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
    let feedback = {};

    if (env.mode === 'evaluate') {
      feedback = reduce(question.choices, (obj, area, key) => {
        obj[key] = getFeedback(session.value, area, key);

        return obj;
      }, {});
    }

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      prompt: question.prompt,
      markup: question.markup,
      choices,
      feedback,

      responseCorrect:
        env.mode === 'evaluate'
          ? isResponseCorrect(question, session)
          : undefined,
    };

    resolve(out);
  });
}

const prepareVal = html => {
  const tmp = document.createElement('DIV');

  tmp.innerHTML = html;

  const value = tmp.textContent || tmp.innerText || '';

  return value.trim();
};

const getScore = (config, session) => {
  const maxScore = Object.keys(config.choices).length;

  const correctCount = reduce(config.choices, (total, respArea, key) => {
    const chosenValue = session.value[key];

    if (isEmpty(chosenValue) || !find(respArea, c => prepareVal(c.label) === prepareVal(chosenValue))) {
      return total - 1;
    }

    return total;
  }, maxScore);

  const str = (correctCount / maxScore).toFixed(2);

  return parseFloat(str);
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
