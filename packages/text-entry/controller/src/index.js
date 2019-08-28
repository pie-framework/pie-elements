import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
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

export const getCorrectness = (question, session, env) => {
  if (env.mode === 'evaluate') {
    if (!session || !session.value) {
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
        prompt: question.prompt,
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

      if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
        out.teacherInstructions = question.teacherInstructions;
      } else {
        out.teacherInstructions = null;
      }

      resolve(out);
    });
  });
}

export const outcome = (question, session, env) =>
  new Promise(resolve => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      const correctness = getCorrectness(question, session, env);

      resolve({ score: correctness === 'correct' ? 1 : 0 });
    }
  });

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { correctResponses: { values } } = question;
      const value = values[0];

      resolve({
        id: '1',
        value
      });
    }
  });
};
