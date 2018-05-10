import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';

const log = debug('@pie-element:text-entry:controller');

const process = (v, ignoreCase, ignoreWhitespace) => {
  let out = v ? v.trim() : '';
  out = !ignoreCase ? out : out.toLowerCase();
  out = !ignoreWhitespace ? out : out.replace(/ /g, '');
  return out;
};

const inResponses = (responses, value) => {
  const processedValues = responses.values.map(c =>
    process(c, responses.ignoreCase, responses.ignoreWhitespace)
  );
  const v = process(value, responses.ignoreCase, responses.ignoreWhitespace);
  return processedValues.indexOf(v) !== -1;
};

const getCorrectness = (question, session, env) => {
  if (env.mode === 'evaluate') {
    if (!session.value) {
      return 'empty';
    }

    const correct = inResponses(question.correctResponses, session.value);
    const partiallyCorrect = inResponses(
      question.partialResponses,
      session.value
    );

    if (correct) {
      return 'correct';
    } else if (partiallyCorrect) {
      return 'partially-correct';
    } else {
      return 'incorrect';
    }
  }
};

export function model(question, session, env) {
  return new Promise((resolve, reject) => {
    const correctness = getCorrectness(question, session, env);

    getFeedbackForCorrectness(correctness, question.feedback).then(feedback => {
      const out = {
        numbersOnlyWarning: undefined,
        colorContrast: 'black_on_white',
        correctness,
        feedback,
        disabled: env.mode !== 'gather',
        answerBlankSize: question.answerBlankSize,
        answerAlignment: question.answerAlignment,
        allowDecimal: question.allowDecimal,
        allowIntegersOnly: question.allowIntegersOnly,
        allowThousandsSeparator: question.allowThousandsSeparator
      };

      resolve(out);
    });
  });
}
