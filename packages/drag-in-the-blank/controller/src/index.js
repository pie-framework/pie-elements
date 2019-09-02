import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';
import { getAllCorrectResponses } from './utils';
import { getShuffledChoices } from '@pie-lib/controller-utils';

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export function model(question, session, env, updateSession) {
  return new Promise(async resolve => {
    let feedback = {};

    if (env.mode === 'evaluate') {
      const responses = getAllCorrectResponses(question) || {};
      const allCorrectResponses = responses.possibleResponses;
      const numberOfPossibleResponses = responses.numberOfPossibleResponses || 0;
      let correctResponses = undefined;
      const { value } = session || {};

      for (let i = 0; i < numberOfPossibleResponses; i++) {
        const result = reduce(allCorrectResponses, (obj, choices, key) => {
          const answer = (value && value[key]) || '';

          obj.feedback[key] = choices[i] === answer;

          if (obj.feedback[key]) {
            obj.correctResponses += 1;
          }

          return obj;
        }, { correctResponses: 0, feedback: {} });

        if (correctResponses === undefined || result.correctResponses > correctResponses) {
          correctResponses = result.correctResponses;
          feedback = result.feedback;
        }

        if (result.correctResponses === numberOfPossibleResponses) {
          break;
        }
      }
    }

    let choices = question.choices;
    if (!question.lockChoiceOrder) {
      choices = await getShuffledChoices(choices, session, updateSession, 'id');
    }

    const out = {
      ...question,
      choices,
      feedback,
      mode: env.mode,
      disabled: env.mode !== 'gather',
      responseCorrect:
        env.mode === 'evaluate'
          ? getScore(question, session) === 1
          : undefined,
    };
    if (
      env.role === 'instructor' &&
      (env.mode === 'view' || env.mode === 'evaluate')
    ) {
      out.rationale = question.rationale;
      out.teacherInstructions = question.teacherInstructions;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
    }

    resolve(out);
  });
}

export const getScore = (config, session) => {
  const responses = getAllCorrectResponses(config);
  const allCorrectResponses = responses.possibleResponses;
  const maxScore = Object.keys(config.correctResponse).length;
  const numberOfPossibleResponses = responses.numberOfPossibleResponses || 0;
  let correctCount = 0;
  const { value } = session || {};

  for (let i = 0; i < numberOfPossibleResponses; i++) {
    const result = reduce(allCorrectResponses, (total, choices, key) => {
      const answer = (value && value[key]) || '';

      if (choices[i] === answer) {
        return total;
      }

      return total - 1;
    }, maxScore);

    if (result > correctCount) {
      correctCount = result;
    }

    if (result === maxScore) {
      break;
    }
  }

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

    resolve({
      score: partialScoringEnabled ? score : score === 1 ? 1 : 0,
      empty: !session || isEmpty(session)
    });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      resolve({
        value: question.correctResponse,
        id: '1'
      });
    }
  });
};
