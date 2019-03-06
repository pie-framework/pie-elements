import { buildState, score } from '@pie-lib/categorize';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import debug from 'debug';
const log = debug('@pie-element:categorize:controller');

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

      const scorePromise = score(state.categories, question.scoring || {});

      scorePromise.then(scoreInfo => {
        if (scoreInfo.score === 1) {
          resolve('correct');
        } else if (scoreInfo.score === 0) {
          resolve('incorrect');
        } else {
          resolve('partially-correct');
        }
      });
    } else {
      resolve(undefined);
    }
  });
};

export const createConfigModel = (model = {}) =>
  new Promise(resolve => {
    const sensibleDefaults = {
      choices: [
        {
          id: '0',
          content: '420 cm = 4.2 meters'
        },
        {
          id: '1',
          content: '3.4 kg = 340 g'
        },
      ],
      categories: [
        {
          id: '0',
          label: 'Equivalent',
        },
        {
          id: '1',
          label: '<b>NOT </b>equivalent',
        }
      ],
      config: {
        choices: {
          columns: 2,
          position: 'below',
        },
        categories: {
          columns: 2
        }
      }
    };

    resolve({
      ...sensibleDefaults,
      ...model,
    })
  });

export const model = (question, session, env) =>
  new Promise(resolve => {
    const correctPromise = getCorrectness(question, session, env);

    correctPromise.then(correctness => {
      const fb =
        env.mode === 'evaluate'
          ? getFeedbackForCorrectness(correctness, question.feedback)
          : Promise.resolve(undefined);

      fb.then(feedback => {
        const out = {
          correctness,
          feedback,
          scoring: question.scoring,
          choices: question.choices,
          categories: question.categories,
          disabled: env.mode !== 'gather',
          config: question.config || {
            choices: {
              columns: 2
            },
            categories: {
              columns: 2
            }
          }
        };

        out.correctResponse =
          env.mode === 'evaluate' ? question.correctResponse : undefined;

        resolve(out);
      });
    })
  });

export const outcome = (question, session, env) => {
  if (env.mode !== 'evaluate') {
    return Promise.reject(
      new Error('Can not call outcome when mode is not evaluate')
    );
  } else {
    const state = buildState(
      question.categories,
      question.choices,
      session.answers,
      question.correctResponse
    );
    log('state: ', state);
    return score(state.categories, question.scoring || {});
  }
};
