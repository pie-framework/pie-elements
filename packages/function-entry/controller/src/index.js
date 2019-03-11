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
        if (!session.value) {
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
