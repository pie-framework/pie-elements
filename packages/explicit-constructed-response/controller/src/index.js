import map from 'lodash/map';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { getShuffledChoices } from '@pie-lib/controller-utils';

const prepareChoice = (mode, defaultFeedback) => choice => {
  const out = {
    label: choice.label,
    value: choice.value
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

const getFeedback = value => {
  if (value) {
    return 'correct';
  }

  return 'incorrect';
};

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export function model(question, session, env, updateSession) {
  return new Promise(resolve => {
    const defaultFeedback = Object.assign(
      { correct: 'Correct', incorrect: 'Incorrect' },
      question.defaultFeedback
    );

    const { value = {} } = session || {};

    const preparChoiceFn = prepareChoice(env.mode, defaultFeedback);

    let choices = reduce(
      question.choices,
      (obj, area, key) => {
        obj[key] = map(area, preparChoiceFn);

        return obj;
      },
      {}
    );
    let feedback = {};

    if (env.mode === 'evaluate') {
      feedback = reduce(question.choices, (obj, respArea, key) => {
        const chosenValue = value && value[key];
        const val = !isEmpty(chosenValue) && find(respArea, c => prepareVal(c.label) === prepareVal(chosenValue));

        obj[key] = getFeedback(val);

        return obj;
      }, {});
    }

    if (!question.lockChoiceOrder) {
      Object.keys(choices).forEach(async key => {
        choices[key] = await getShuffledChoices(choices[key], session, updateSession, 'value');
      });
    }

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      prompt: question.prompt,
      markup: question.markup,
      choices,
      feedback,

      responseCorrect:
        env.mode === 'evaluate' ? getScore(question, session) === 1 : undefined
    };

    if (
      env.role === 'instructor' &&
      (env.mode === 'view' || env.mode === 'evaluate')
    ) {
      out.rationale = question.rationaleEnabled ? question.rationale : null;
      out.teacherInstructions = question.teacherInstructionsEnabled ? question.teacherInstructions : null;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
    }

    resolve(out);
  });
}

const prepareVal = html => {
  const tmp = document.createElement('DIV');

  tmp.innerHTML = html;

  const value = tmp.textContent || tmp.innerText || '';

  return value.trim();
};

export const getScore = (config, session) => {
  const { value } = session || {};

  if (!session || isEmpty(session) || !value) {
    return 0;
  }

  const maxScore = Object.keys(config.choices).length;
  const correctCount = reduce(config.choices, (total, respArea, key) => {
    const chosenValue = value && value[key];

    if (isEmpty(chosenValue) || !find(respArea, c => prepareVal(c.label) === prepareVal(chosenValue))) {
      return total - 1;
    }

    return total;
  }, maxScore);

  const str = maxScore ? (correctCount / maxScore).toFixed(2) : 0;

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
export function outcome(model, session) {
  return new Promise(resolve => {
    const partialScoringEnabled = model.partialScoring || false;
    const score = getScore(model, session);

    resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0, empty: isEmpty(session) });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question;
      const value = {};

      Object.keys(choices).forEach((key, i) => {
        value[i] = choices[key][0].label;
      });

      resolve({
        id: '1',
        value
      });
    }
  });
};
