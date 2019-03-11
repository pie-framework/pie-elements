import debug from 'debug';

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

export function model(question, session, env) {
  return new Promise(resolve => {
    const getResult = () => {
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

    const choices = question.choices.map(c => ({
      label: c.label,
      value: c.value
    }));

    resolve({
      choices,
      disabled: env.mode !== 'gather',
      result: env.mode === 'evaluate' ? getResult() : undefined
    });
  });
}
