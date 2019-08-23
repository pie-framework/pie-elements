import forEach from 'lodash/forEach';
import { buildState, score } from '@pie-lib/categorize';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import shuffle from 'lodash/shuffle';
import compact from 'lodash/compact';

import defaults from './defaults';

const lg = n => console[n].bind(console, '[multiple-choice]');
const debug = lg('debug');
const log = lg('log');
const warn = lg('warn');
const error = lg('error');

export { score };

export const getCorrectness = (question, session, env) => {
  return new Promise(resolve => {
    if (env.mode === 'evaluate') {
      const state = buildState(
        question.categories,
        question.choices,
        session.answers,
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

const getShuffledChoices = async (choices, session, updateSession) => {
  log('updateSession type: ', typeof updateSession);
  log('session: ', session);
  if (session.shuffledValues) {
    debug('use shuffledValues to sort the choices...', session.shuffledValues);

    return compact(
      session.shuffledValues.map(v => choices.find(c => c.id === v))
    );
  } else {
    const shuffledChoices = shuffle(choices);

    if (updateSession && typeof updateSession === 'function') {
      try {
        const shuffledValues = shuffledChoices.map(c => c.id);
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
export const model = (question, session, env, updateSession) =>
  new Promise(resolve => {
    const correctPromise = getCorrectness(question, session, env);

    correctPromise.then(async correctness => {
      const fb =
        env.mode === 'evaluate' && question.allowFeedback
          ? getFeedbackForCorrectness(correctness, question.feedback)
          : Promise.resolve(undefined);

      let choices = question.choices;
      if (!question.lockChoiceOrder) {
        choices = await getShuffledChoices(choices, session, updateSession);
      }

      fb.then(feedback => {
        const out = {
          correctness,
          feedback,
          prompt: question.prompt,
          choices,
          categories: question.categories,
          disabled: env.mode !== 'gather',
          choicesPerRow: question.choicesPerRow || 2,
          choicesLabel: question.choicesLabel || '',
          choicesPosition: question.choicesPosition,
          removeTilesAfterPlacing: question.removeTilesAfterPlacing,
          lockChoiceOrder: question.lockChoiceOrder,
          categoriesPerRow: question.categoriesPerRow || 2,
          rowLabels: question.rowLabels
        };

        out.correctResponse =
          env.mode === 'evaluate' ? question.correctResponse : undefined;

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
    });
  });

const isCorrect = (correctResponse, c) => correctResponse.find(cR => cR === c);

export const getScore = (category, choices, correctResponse, session) => {
  const maxScore = choices.length;

  const chosen = choiceId => !!(session || []).find(v => v === choiceId);

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
  return parseFloat(str, 10);
};

const getTotalScore = (question, session) => {
  const { categories, correctResponse } = question;

  const correctCount = categories.reduce((total, category) => {
    const response = correctResponse.find(cR => cR.category === category.id) || {};
    const sessionAnswers = session.answers || [];
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

  const str = (correctCount / categories.length).toFixed(2);

  return parseFloat(str, 10);
};

export const outcome = (question, session, env) => {
  if (env.mode !== 'evaluate') {
    return Promise.reject(
      new Error('Can not call outcome when mode is not evaluate')
    );
  } else {
    return new Promise(resolve => {
      resolve({
        score: question.partialScoring ? getTotalScore(question, session) : 0,
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
      })
    });
  }
};
