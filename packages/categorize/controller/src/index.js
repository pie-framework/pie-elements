import { buildState, score } from '@pie-lib/categorize';
import debug from 'debug';
const log = debug('@pie-element:categorize:controller');

export const model = (question, session, env) =>
  new Promise(resolve => {
    const out = {
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
