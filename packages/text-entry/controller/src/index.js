
import debug from 'debug';

const log = debug('@pie-element:text-entry:controller');

const process = (v, ignoreCase, ignoreWhitespace) => {
  let out = v ? v.trim() : '';
  out = !ignoreCase ? out : out.toLowerCase();
  out = !ignoreWhitespace ? out : out.replace(/ /g, '');
  return out;
}

const inResponses = (responses, value) => {
  const processedValues = responses.values.map(c => process(c, responses.ignoreCase, responses.ignoreWhitespace));
  const v = process(value, responses.ignoreCase, responses.ignoreWhitespace);
  return processedValues.indexOf(v) !== -1;
}

export function model(question, session, env) {
  return new Promise((resolve, reject) => {

    const { model, correctResponses } = question;

    const defaultFeedback = Object.assign({
      correct: 'Correct',
      incorrect: 'Incorrect',
      'partially-correct': 'Nearly',
      empty: 'The answer is empty'
    }, question.defaultFeedback);

    const getFeedback = (correctness) => {

      const fb = (config) => {
        config = config || {};
        if (config.type === 'custom') {
          return config.value;
        } else if (config.type === 'default') {
          return 'Correct';
        }
      }

      if (env.mode === 'evaluate') {

        if (correctness === 'correct') {
          return fb(question.correctResponses.feedback, defaultFeedback.correct);
        }

        if (correctness === 'partially-correct') {
          return fb(question.partialResponses.feedback, defaultFeedback['partially-correct']);
        }

        if (correctness === 'incorrect') {
          return fb(question.incorrectFeedback, defaultFeedback.incorrect);
        }

        if (correctness === 'empty') {
          return defaultFeedback.empty;
        }
      }
    }

    const getCorrectness = () => {
      if (env.mode === 'evaluate') {

        if (!session.value) {
          return 'empty';
        }

        const correct = inResponses(question.correctResponses, session.value);
        const partiallyCorrect = inResponses(question.partialResponses, session.value);

        if (correct) {
          return 'correct';
        } else if (partiallyCorrect) {
          return 'partially-correct';
        } else {
          return 'incorrect'
        }
      }
    }


    const correctness = getCorrectness();
    const base = {
      numbersOnlyWarning: undefined,
      colorContrast: 'black_on_white',
      correctness,
      feedback: getFeedback(correctness),
      disabled: env.mode !== 'gather'
    }

    const out = Object.assign(base, model);
    log('out: ', out);
    resolve(out);
  });
}