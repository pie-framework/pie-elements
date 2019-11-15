import isEmpty from 'lodash/isEmpty';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { getShuffledChoices } from '@pie-lib/controller-utils';
import debug from 'debug';

const log = debug('@pie-element:match-list:controller');

import defaults from './defaults';

const getResponseCorrectness = (model, answers) => {
  const partialScoring = true; /*model.partialScoring*/
  const prompts = model.prompts;

  if (!answers || Object.keys(answers).length === 0) {
    return 'unanswered';
  }

  const totalCorrectAnswers = getTotalCorrect(model);
  const correctAnswers = getCorrectSelected(prompts, answers);

  if (totalCorrectAnswers === correctAnswers) {
    return 'correct';
  } else if (correctAnswers === 0) {
    return 'incorrect';
  } else if (partialScoring) {
    return 'partial';
  }

  return 'incorrect';
};

const getCorrectness = (question, env, answers) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(question, answers);
  }
};

const getCorrectSelected = (prompts = [], answers) => {
  let correctAnswers = 0;

  prompts.forEach(p => {
    if (p.relatedAnswer === answers[p.id]) {
      correctAnswers += 1;
    }
  });

  return correctAnswers;
};

const getTotalCorrect = question => {
  return question && question.prompts ? question.prompts.length : 0;
};

const getPartialScore = (question, answers) => {
  const count = getCorrectSelected(question && question.prompts, answers);
  const totalCorrect = getTotalCorrect(question);

  return parseFloat((count / totalCorrect).toFixed(2));
};

const getOutComeScore = (question, env, answers) => {
  const correctness = getCorrectness(question, env, answers);

  return correctness === 'correct'
    ? 1
    : correctness === 'partial' && true
    ? getPartialScore(question, answers)
    : 0;
};

export const outcome = (question, session, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      if (!session || isEmpty(session)) {
        resolve({ score: 0, empty: true });
      } else {
        const out = {
          score: getOutComeScore(question, env, session.value)
        };

        resolve(out);
      }
    }
  });
};

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      ...defaults,
      ...model
    });
  });
}

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export function model(question, session, env, updateSession) {
  return new Promise(async resolve => {
    const correctness = getCorrectness(question, env, session && session.value);
    const correctResponse = {};
    const score = `${getOutComeScore(question, env, session && session.value) *
      100}%`;
    const correctInfo = {
      score,
      correctness
    };

    const shuffledValues = {};
    let prompts = question.prompts;
    let answers = question.answers;

    const us = part => (id, element, update) => {
      return new Promise(resolve => {
        shuffledValues[part] = update.shuffledValues;
        resolve();
      });
    };

    if (!question.lockChoiceOrder) {
      prompts = await getShuffledChoices(
        prompts,
        { shuffledValues: ((session && session.shuffledValues) || {}).prompts },
        us('prompts'),
        'id'
      );
      answers = await getShuffledChoices(
        answers,
        { shuffledValues: ((session && session.shuffledValues) || {}).answers },
        us('answers'),
        'id'
      );
    }

    if (!isEmpty(shuffledValues)) {
      if (updateSession && typeof updateSession === 'function') {
        updateSession(session.id, session.element, {
          shuffledValues
        }).catch(e => {
          console.error('update session failed', e);
        });
      }
    }

    if (question && prompts) {
      prompts.forEach(prompt => {
        correctResponse[prompt.id] = prompt.relatedAnswer;
      });
    }

    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctInfo.correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        config: {
          ...question,
          prompts,
          answers,
          shuffled: !question.lockChoiceOrder
        },
        correctness: correctInfo,
        feedback,
        mode: env.mode
      };

      if (
        env.role === 'instructor' &&
        (env.mode === 'view' || env.mode === 'evaluate')
      ) {
        base.rationale = question.rationale;
      } else {
        base.rationale = null;
      }

      const out = Object.assign(base, {
        correctResponse
      });

      log('out: ', out);
      resolve(out);
    });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { prompts, answers } = question;
      const value = {};

      prompts.forEach(p => {
        if (answers.filter(a => a.id === p.relatedAnswer).length) {
          value[p.id] = p.relatedAnswer;
        }
      });

      resolve({
        value,
        id: '1'
      });
    } else {
      resolve(null);
    }
  });
};
