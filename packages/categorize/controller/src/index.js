import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import { buildState, score } from '@pie-lib/categorize';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { getShuffledChoices } from '@pie-lib/controller-utils';

import defaults from './defaults';
import debug from 'debug';

const log = debug('@pie-element:categorize:controller');

export { score };

export const getCorrectness = (question, session, env) => {
  return new Promise(resolve => {
    if (env.mode === 'evaluate') {
      const state = buildState(
        question.categories,
        question.choices,
        (session && session.answers) || [],
        question.correctResponse
      );
      log('state: ', state);

      const scoreInfo = getTotalScore(question, session);

      if (scoreInfo === 1) {
        resolve('correct');
      } else if (scoreInfo === 0) {
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
  new Promise(resolve => {
    resolve({
      ...defaults,
      ...model,
    })
  });

export const normalize = question => ({
  feedbackEnabled: true,
  rationaleEnabled: true,
  promptEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question
});

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export const model = (question, session, env, updateSession) =>
  new Promise(resolve => {
    const normalizedQuestion = normalize(question);
    const correctPromise = getCorrectness(normalizedQuestion, session, env);

    const {
      feedbackEnabled,
      feedback,
      lockChoiceOrder,
      promptEnabled,
      prompt,
      categories,
      choicesPerRow,
      choicesLabel,
      choicesPosition,
      removeTilesAfterPlacing,
      categoriesPerRow,
      rowLabels,
      correctResponse,
      rationaleEnabled,
      rationale,
      teacherInstructionsEnabled,
      teacherInstructions
    } = normalizedQuestion;
    let { choices } = normalizedQuestion;

    correctPromise.then(async correctness => {
      const fb =
        env.mode === 'evaluate' && feedbackEnabled
          ? getFeedbackForCorrectness(correctness, feedback)
          : Promise.resolve(undefined);

      if (!lockChoiceOrder) {
        choices = await getShuffledChoices(choices, session, updateSession, 'id');
      }

      fb.then(feedback => {
        const out = {
          correctness,
          feedback,
          prompt: promptEnabled ? prompt : null,
          choices: choices || [],
          categories: categories || [],
          disabled: env.mode !== 'gather',
          choicesPerRow: choicesPerRow || 2,
          choicesLabel: choicesLabel || '',
          choicesPosition,
          removeTilesAfterPlacing,
          lockChoiceOrder,
          categoriesPerRow: categoriesPerRow || 2,
          rowLabels
        };

        out.correctResponse =
          env.mode === 'evaluate' ? correctResponse : undefined;

        if (
          env.role === 'instructor' &&
          (env.mode === 'view' || env.mode === 'evaluate')
        ) {
          out.rationale = rationaleEnabled ? rationale : null;
          out.teacherInstructions = teacherInstructionsEnabled ? teacherInstructions : null;
        } else {
          out.rationale = null;
          out.teacherInstructions = null;
        }

        resolve(out);
      });
    });
  });

const isCorrect = (correctResponse, c) => correctResponse.find(cR => cR === c);

export const getScore = (category, choices, correctResponse, sessionChoices) => {
  const maxScore = choices.length;

  const chosen = choiceId => !!(sessionChoices || []).find(v => v === choiceId);

  const correctAndNotChosen = c => isCorrect(correctResponse, c) && !chosen(c);
  const incorrectAndChosen = c => !isCorrect(correctResponse, c) && chosen(c);

  const correctCount = choices.reduce((total, choice) => {
    if (correctAndNotChosen(choice.id) || incorrectAndChosen(choice.id)) {
      return total - 1;
    } else {
      return total;
    }
  }, choices.length);

  const str = (correctCount / maxScore).toFixed(2);
  return parseFloat(str);
};

export const getTotalScore = (question, session) => {
  const { categories, correctResponse } = question;
  const correctCount = categories.reduce((total, category) => {
    const response = correctResponse.find(cR => cR.category === category.id) || {};
    const sessionAnswers = (session && session.answers) || [];
    const answers = sessionAnswers.find(a => a.category === category.id) || {};
    let choiceScore = getScore(
      category,
      question.choices,
      response.choices || [],
      answers.choices || []
    );

    forEach((response.alternateResponses || []), (choices) => {
      const currentScore = getScore(
        category,
        question.choices,
        choices || [],
        answers.choices || []
      );

      if (currentScore >= choiceScore) {
        choiceScore = currentScore;
      }
    });

    return total + choiceScore;
  }, 0);

  const categoriesLength = categories.length;
  const str = categoriesLength ? (correctCount / categoriesLength).toFixed(2) : 0;

  return question.partialScoring ? parseFloat(str) : parseInt(str, 10);
};

export const outcome = (question, session, env) => {
  if (env.mode !== 'evaluate') {
    return Promise.reject(
      new Error('Can not call outcome when mode is not evaluate')
    );
  } else {
    return new Promise(resolve => {
      resolve({
        score: getTotalScore(question, session),
        empty: !session || isEmpty(session)
      });
    });
  }
};

export const createCorrectResponseSession = (question, env) => {
  if (env.mode !== 'evaluate' && env.role === 'instructor') {
    const { correctResponse } = question;

    return new Promise(resolve => {
      resolve({
        answers: correctResponse,
        id: 1
      });
    });
  }
};
