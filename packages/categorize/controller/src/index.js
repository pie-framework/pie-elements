import isEmpty from 'lodash/isEmpty';
import { buildState, score } from '@pie-lib/categorize';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import {
  lockChoices,
  getShuffledChoices,
  partialScoring,
} from '@pie-lib/controller-utils';
import defaults from './defaults';

// eslint-disable-next-line no-console

export { score };

export const getPartialScore = (correctResponse, builtCategories) => {
  // in the resulted best scenario we make a sum with all the correct responses
  // and all the placements
  const { placements, score } = builtCategories.reduce(
    (acc, { choices = [] }) => ({
      placements: acc.placements + choices.length,
      score: acc.score + choices.filter((ch) => ch.correct).length,
    }),
    { placements: 0, score: 0 }
  );

  // in the correct response, we make a sum of the max possible score
  const { maxScore } = correctResponse.reduce(
    (acc, { choices }) => ({
      maxScore: acc.maxScore + choices.length,
    }),
    { maxScore: 0 }
  );

  // if there are any extra placements, we subtract from the obtained score
  const extraPlacements = placements > maxScore ? placements - maxScore : 0;
  const totalScore = (score - extraPlacements) / maxScore;

  return totalScore < 0 ? 0 : parseFloat(totalScore.toFixed(2));
};

export const getTotalScore = (question, session, env) => {
  if (!session) {
    return 0;
  }

  if (Object.keys(session).length === 0) {
    return 0;
  }
  const { categories, choices } = question || {};
  let { correctResponse } = question || {};
  let { answers } = session || {};
  answers = answers || [];
  correctResponse = correctResponse || [];

  // this function is used in pie-ui/categorize as well, in order to get the best scenario
  // so we get the best scenario and calculate the score
  const { categories: builtCategories, correct } = buildState(
    categories,
    choices,
    answers,
    correctResponse
  );

  const hasAlternates = correctResponse
    .map((c) => c.alternateResponses)
    .filter((alternate) => alternate);
  const enabled = partialScoring.enabled(question, env);

  // if there are any alternates, there will be no partial scoring!
  if (enabled && !hasAlternates.length) {
    // we apply partial scoring
    return getPartialScore(correctResponse, builtCategories);
  }

  // else we apply dichotomous
  return correct ? 1 : 0;
};

export const getCorrectness = (question, session, env) => {
  return new Promise((resolve) => {
    if (env.mode === 'evaluate') {
      const score = getTotalScore(question, session, env);
      if (score === 1) {
        resolve('correct');
      } else if (score === 0) {
        resolve('incorrect');
      } else {
        resolve('partially-correct');
      }
    } else {
      resolve(undefined);
    }
  });
};

export const createDefaultModel = (model = {}) =>
  new Promise((resolve) => {
    resolve({
      ...defaults,
      ...model,
    });
  });

export const normalize = (question) => ({
  feedbackEnabled: true,
  rationaleEnabled: true,
  promptEnabled: true,
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
export const model = (question, session, env, updateSession) =>
  new Promise(async (resolve) => {
    const normalizedQuestion = normalize(question);
    const answerCorrectness = getCorrectness(normalizedQuestion, session, env);

    const { mode, role } = env || {};

    const {
      categories,
      categoriesPerRow,
      choicesPerRow,
      choicesLabel,
      choicesPosition,
      correctResponse,
      feedback,
      feedbackEnabled,
      promptEnabled,
      prompt,
      removeTilesAfterPlacing,
      rowLabels,
      rationaleEnabled,
      rationale,
      teacherInstructionsEnabled,
      teacherInstructions,
    } = normalizedQuestion;
    let { choices } = normalizedQuestion;
    let fb;

    const lockChoiceOrder = lockChoices(normalizedQuestion, session, env);

    if (mode === 'evaluate' && feedbackEnabled) {
      fb = await getFeedbackForCorrectness(
        answerCorrectness.correctness,
        feedback
      );
    }

    if (!lockChoiceOrder) {
      choices = await getShuffledChoices(choices, session, updateSession, 'id');
    }

    const out = {
      categories: categories || [],
      categoriesPerRow: categoriesPerRow || 2,
      correctness: answerCorrectness.correctness,
      choices: choices || [],
      choicesLabel: choicesLabel || '',
      choicesPerRow: choicesPerRow || 2,
      choicesPosition,
      disabled: mode !== 'gather',
      feedback: fb,
      lockChoiceOrder,
      prompt: promptEnabled ? prompt : null,
      removeTilesAfterPlacing,
      rowLabels,
      correctResponse: mode === 'evaluate' ? correctResponse : undefined,
    };

    if (role === 'instructor' && (mode === 'view' || mode === 'evaluate')) {
      out.rationale = rationaleEnabled ? rationale : null;
      out.teacherInstructions = teacherInstructionsEnabled
        ? teacherInstructions
        : null;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
    }

    resolve(out);
  });

export const outcome = (question, session, env) => {
  if (env.mode !== 'evaluate') {
    return Promise.reject(
      new Error('Can not call outcome when mode is not evaluate')
    );
  } else {
    return new Promise((resolve) => {
      resolve({
        score: getTotalScore(question, session, env),
        empty: !session || isEmpty(session),
      });
    });
  }
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    const { mode, role } = env || {};

    if (mode !== 'evaluate' && role === 'instructor') {
      const { correctResponse } = question;

      resolve({ answers: correctResponse, id: 1 });
    } else {
      return resolve(null);
    }
  });
};
