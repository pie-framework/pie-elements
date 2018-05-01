import debug from 'debug';
import mathjs from 'mathjs';

const log = debug('@pie-element:function-entry:controller');

const process = v => mathjs.simplify(v ? v.trim() : '');

const isResponseCorrect = (correctResponse, model, value) => {
  const processedValue = process(value);

  return processedValue.equals(mathjs.simplify(correctResponse));
};

export function model(question, session, env) {
  return new Promise((resolve) => {

    const { model, correctResponse } = question;

    const defaultFeedback = Object.assign({
      correct: 'Correct',
      incorrect: 'Incorrect',
      empty: 'The answer is empty'
    }, question.defaultFeedback);

    const getFeedback = (correctness) => {
      const fb = (config, defaultValue, incorrect) => {
        config = config || {};

        if (config.type === 'none') {
          return '';
        } else if (config.type === 'custom') {
          return config.value;
        } else if (config.type === 'default' && !incorrect) {
          return 'Correct';
        }

        return defaultValue;
      };

      if (env.mode === 'evaluate') {
        if (correctness === 'correct') {
          return fb(question.correctResponse.feedback, defaultFeedback.correct);
        }

        if (correctness === 'incorrect') {
          return fb(question.incorrectFeedback, defaultFeedback.incorrect, true);
        }

        if (correctness === 'empty') {
          return defaultFeedback.empty;
        }
      }
    };

    const getCorrectness = () => {
      if (env.mode === 'evaluate') {

        if (!session.value) {
          return 'empty';
        }

        return isResponseCorrect(correctResponse.equation, model, session.value) ? 'correct' : 'incorrect';
      }
    };


    const correctness = getCorrectness();
    const base = {
      correctness,
      feedback: getFeedback(correctness),
      disabled: env.mode !== 'gather'
    };

    const out = Object.assign(base, model);

    log('out: ', out);

    resolve(out);
  });
}
