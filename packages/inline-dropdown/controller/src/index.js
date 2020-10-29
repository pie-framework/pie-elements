import map from 'lodash/map';
import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';
import {
  lockChoices,
  getShuffledChoices,
  partialScoring,
} from '@pie-lib/controller-utils';

import { getAllCorrectResponses } from './utils';

const getFeedback = (correct) => {
  if (correct) {
    return 'correct';
  }

  return 'incorrect';
};

export const normalize = (question) => ({
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export function model(question, session, env, updateSession) {
  return new Promise(async (resolve) => {
    const normalizedQuestion = normalize(question);
    const { value = {} } = session || {};
    let choices = reduce(
      normalizedQuestion.choices,
      (obj, area, key) => {
        obj[key] = map(area, (choice) => choice);

        return obj;
      },
      {}
    );

    let feedback = {};

    if (env.mode === 'evaluate') {
      const allCorrectResponses = getAllCorrectResponses(normalizedQuestion);
      const respAreaLength = Object.keys(allCorrectResponses).length;
      let correctResponses = 0;

      for (let i = 0; i < respAreaLength; i++) {
        const result = reduce(
          allCorrectResponses,
          (obj, choices, key) => {
            const answer = (value && value[key]) || '';
            const correctChoice = choices[i] || '';
            const isCorrect =
              answer && correctChoice && correctChoice === answer;

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

    const lockChoiceOrder = lockChoices(normalizedQuestion, session, env);

    if (!lockChoiceOrder) {
      const keys = Object.keys(choices);
      let i;

      for (i = 0; i < keys.length; i++) {
        const key = keys[i];

        choices[key] = await getShuffledChoices(
          choices[key],
          session,
          updateSession,
          'value'
        );
      }
    }

    let teacherInstructions = null;
    let rationale = null;

    if (
      env.role === 'instructor' &&
      (env.mode === 'view' || env.mode === 'evaluate')
    ) {
      rationale = normalizedQuestion.rationaleEnabled
        ? normalizedQuestion.rationale
        : null;
      teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
        ? normalizedQuestion.teacherInstructions
        : null;
    } else {
      rationale = null;
      teacherInstructions = null;
    }

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      prompt: normalizedQuestion.promptEnabled
        ? normalizedQuestion.prompt
        : null,
      markup: normalizedQuestion.markup,
      choices,
      feedback,

      responseCorrect:
        env.mode === 'evaluate'
          ? getScore(normalizedQuestion, session) === 1
          : undefined,
      rationale,
      teacherInstructions,
    };

    resolve(out);
  });
}

export const getScore = (config, session) => {
  const { value = {} } = session || {};
  const maxScore =
    config && config.choices ? Object.keys(config.choices).length : 0;
  const allCorrectResponses = getAllCorrectResponses(config);
  let correctCount = 0;

  for (let i = 0; i < maxScore; i++) {
    const result = reduce(
      allCorrectResponses,
      (total, choices, key) => {
        const answer = (value && value[key]) || '';
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
export function outcome(model, session, env = {}) {
  return new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    const partialScoringEnabled = partialScoring.enabled(model, env);
    const score = getScore(model, session);

    resolve({
      score: partialScoringEnabled ? score : Math.floor(score),
      empty: false,
    });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question;
      const value = {};

      if (choices) {
        Object.keys(choices).forEach((key, i) => {
          const correctChoices =
            choices[key] && choices[key].filter((c) => c.correct);

          value[i] = correctChoices && correctChoices[0].value;
        });
      }

      resolve({
        id: '1',
        value,
      });
    } else {
      resolve(null);
    }
  });
};
