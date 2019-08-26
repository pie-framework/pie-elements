import shuffle from 'lodash/shuffle';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import compact from 'lodash/compact';

const lg = n => console[n].bind(console, '[inline-dropdown]');
const debug = lg('debug');
const log = lg('log');
const warn = lg('warn');
const error = lg('error');

import { getAllCorrectResponses } from './utils';

const prepareChoice = () => (key, choice) => {
  return {
    label: choice.label,
    value: choice.value
  };
};

const getFeedback = correct => {
  if (correct) {
    return 'correct';
  }

  return 'incorrect';
};

const getShuffledChoices = async (choices, session, updateSession) => {
  log('updateSession type: ', typeof updateSession);
  log('session: ', session);
  if (session.shuffledValues) {
    debug('use shuffledValues to sort the choices...', session.shuffledValues);

    return compact(
      session.shuffledValues.map(v => choices.find(c => c.value === v))
    );
  } else {
    const shuffledChoices = shuffle(choices);

    if (updateSession && typeof updateSession === 'function') {
      try {
        //Note: session.id refers to the id of the element within a session
        const shuffledValues = shuffledChoices.map(c => c.value);
        log('try to save shuffledValues to session...', shuffledValues);
        console.log('call updateSession... ', session.id, session.element);
        await updateSession(session.id, session.element, { shuffledValues });
      } catch (e) {
        warn('unable to save shuffled order for choices');
        error(e);
      }
    } else {
      warn('unable to save shuffled choices, shuffle will happen every time.');
    }
    //save this shuffle to the session for later retrieval
    return shuffledChoices;
  }
};

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export function model(question, session, env, updateSession) {
  session = session || { value: {} };
  session.value = session.value || {};
  return new Promise(async resolve => {
    const defaultFeedback = Object.assign(
      { correct: 'Correct', incorrect: 'Incorrect' },
      question.defaultFeedback
    );
    const preparChoiceFn = prepareChoice(env.mode, defaultFeedback);

    let choices = reduce(
      question.choices,
      (obj, area, key) => {
        obj[key] = map(area, choice => preparChoiceFn(key, choice));

        return obj;
      },
      {}
    );

    let feedback = {};

    if (env.mode === 'evaluate') {
      const allCorrectResponses = getAllCorrectResponses(question);
      const respAreaLength = Object.keys(allCorrectResponses).length;
      let correctResponses = 0;

      for (let i = 0; i < respAreaLength; i++) {
        const result = reduce(
          allCorrectResponses,
          (obj, choices, key) => {
            const answer = session.value[key] || '';
            const correctChoice = choices[i] || '';
            const isCorrect = answer && correctChoice && correctChoice === answer;

            obj.feedback[key] = getFeedback(isCorrect);

            if (isCorrect) {
              obj.correctResponses += 1;
            }

            return obj;
          },
          { correctResponses: 0, feedback: {} }
        );

        if (result.correctResponses >= correctResponses) {
          correctResponses = result.correctResponses;
          feedback = result.feedback;
        }

        if (result.correctResponses === respAreaLength) {
          break;
        }
      }
    }

    if (!question.lockChoiceOrder) {
      Object.keys(choices).forEach(async key => {
        choices[key] = await getShuffledChoices(choices[key], session, updateSession);
      });
    }

    let teacherInstructions = null;
    let rationale = null;

    if (
      // env.role === 'instructor' &&
      (env.mode === 'view' || env.mode === 'evaluate')
    ) {
      rationale = question.rationale;
      teacherInstructions = question.teacherInstructions;
    }

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      prompt: question.prompt,
      shuffle: !question.lockChoiceOrder,
      markup: question.markup,
      choices,
      feedback,

      responseCorrect:
        env.mode === 'evaluate' ? getScore(question, session) === 1 : undefined,
      rationale,
      teacherInstructions
    };

    resolve(out);
  });
}

const getScore = (config, session) => {
  const maxScore = Object.keys(config.choices).length;
  const allCorrectResponses = getAllCorrectResponses(config);
  let correctCount = 0;

  for (let i = 0; i < maxScore; i++) {
    const result = reduce(
      allCorrectResponses,
      (total, choices, key) => {
        const answer = session.value[key] || '';
        const correctChoice = choices[i] || '';

        if (correctChoice && answer && correctChoice === answer) {
          return total;
        }

        return total - 1;
      },
      maxScore
    );

    if (result > correctCount) {
      correctCount = result;
    }

    if (result === maxScore) {
      break;
    }
  }

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
export function outcome(model, session) {
  return new Promise(resolve => {
    const partialScoringEnabled = model.partialScoring || false;
    const score = getScore(model, session);

    resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0 });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question;
      const value = {};

      Object.keys(choices).forEach((key, i) => {
        value[i] = choices[key].filter(c => c.correct)[0].value;
      });

      resolve({
        id: '1',
        value
      });
    }
  });
};
