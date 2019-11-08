import debug from 'debug';
import isEmpty from 'lodash/isEmpty';

import defaults from './defaults';

const log = debug('pie-element:inline-choice:controller');

/** build a ui model to work with @pie-ui/inline-choice */

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      ...defaults,
      ...model
    });
  });
}

export const getResult = (question, session) => {
  if (!session || !session.value) {
    return { correct: false, nothingSubmitted: true, feedback: undefined };
  }

  const c = question.choices.find(c => c.value === session.value);

  log('[getResult] c: ', c);
  const correct = c && !!c.correct;

  const feedback = (() => {
    if (!c || !c.feedback) {
      return undefined;
    }

    const fb = c.feedback || {};

    if (fb.type === 'custom') {
      return fb.value;
    } else {
      return correct ? 'Correct' : 'Incorrect';
    }
  })();

  return { correct, feedback };
};


export function model(question, session, env) {
  return new Promise(resolve => {

    const choices = question.choices.map(c => ({
      label: c.label,
      value: c.value
    }));

    resolve({
      choices,
      disabled: env.mode !== 'gather',
      result: env.mode === 'evaluate' ? getResult(question, session) : undefined
    });
  });
}

export function outcome(question, session, env) {
  return new Promise(resolve => {
    log('outcome...');
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    const result = getResult(question, session);
    resolve({ score: result.correct ? 1 : 0 });
  });
}


export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question;
      const correctChoice = choices && choices.find(c => c.correct);

      resolve({
        id: '1',
        value: correctChoice && correctChoice.value
      });
    } else {
      resolve(null);
    }
  });
};
