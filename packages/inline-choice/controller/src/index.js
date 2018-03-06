import debug from 'debug';

const log = debug('pie-element:inline-choice:controller');

/** build a ui model to work with @pie-ui/inline-choice */

export function model(question, session, env) {
  return new Promise((resolve, reject) => {

    const getResult = () => {
      if (!session || !session.selectedChoice) {
        return { correct: false, nothingSubmitted: true }
      }

      const c = question.choices.find(c => c.value === session.selectedChoice);

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

      return { correct, feedback }
    }

    const choices = question.choices.map(c => ({ label: c.label, value: c.value }));

    resolve({
      choices,
      disabled: env.mode !== 'gather',
      result: env.mode === 'evaluate' ? getResult() : undefined
    });
  });
}