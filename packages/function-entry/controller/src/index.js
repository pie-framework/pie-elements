import debug from 'debug';
import mathjs from 'mathjs';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';

import defaults from './defaults';

const log = debug('@pie-element:function-entry:controller');

const process = v => mathjs.simplify(v ? v.trim() : '');

const isResponseCorrect = (correctResponse, value) => {
  const processedValue = process(value);
  const cr = mathjs.simplify(correctResponse);
  log('processed:', processedValue);
  log('correctResponse:', cr);
  return processedValue.equals(cr);
};

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      ...defaults,
      ...model,
    });
  });
}

export function model(question, session, env) {
  return new Promise(resolve => {
    const { showFormattingHelp, equation, feedback } = question;

    const getCorrectness = () => {
      if (env.mode === 'evaluate') {
        if (!session || !session.value) {
          return 'empty';
        }

        return isResponseCorrect(equation, session.value)
          ? 'correct'
          : 'incorrect';
      }
    };

    const correctness = getCorrectness();
    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctness, feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const out = {
        showFormattingHelp,
        correctness,
        feedback,
        disabled: env.mode !== 'gather'
      };

      log('out: ', out);

      resolve(out);
    });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { equation } = question;

      resolve({
        id: '1',
        value: equation
      });
    } else {
      resolve(null);
    }
  });
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
export function outcome(model, session, env) {
  return new Promise(resolve => {
    if (env.mode === 'evaluate') {
      if (!session || !session.value) {
        resolve({ score: 0, empty: true });
      }

      resolve({ score: isResponseCorrect(model && model.equation, session.value) ? 1 : 0 });
    }
  });
}

