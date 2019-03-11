import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import areValuesEqual from '@pie-lib/math-evaluator';

import defaults from './defaults';

const log = debug('@pie-element:math-inline:controller');

const getResponseCorrectness = (
  model,
  answers
) => {
  const correctResponses = model.responses;

  if (!answers || answers.length === 0) {
    return 'unanswered';
  }

  const correctAnswers = getCorrectAnswers(correctResponses, answers);

  if (correctResponses.length === correctAnswers.count) {
    return  { correctness: 'correct', score: '100%', info: correctAnswers.info };
  } else if (correctAnswers === 0) {
    return { correctness: 'incorrect', score: '0%', info: correctAnswers.info };
  }

  return { correctness: 'incorrect', score: '0%', info: correctAnswers.info };
};

function getCorrectAnswers(correctResponses, answers) {
  let correct = 0;
  const answerInfo = {};

  correctResponses.forEach(correctResponse => {
    let answerCorrect = false;
    const correspondingAnswer = answers[correctResponse.id];
    const acceptedValues = [correctResponse.answer].concat(Object.keys(correctResponse.alternates).map(alternateId =>
      correctResponse.alternates[alternateId].answer));

    if (correspondingAnswer && correspondingAnswer.value) {
      if (correctResponse.validation === 'literal') {
        for (let i = 0; i < acceptedValues.length; i++) {
          if (acceptedValues[i] === correspondingAnswer.value) {
            answerCorrect = true;
            break;
          }
        }
      } else {
        answerCorrect = areValuesEqual(correctResponse.answer, correspondingAnswer.value, { isLatex: true });
      }
    }

    if (answerCorrect) {
      answerInfo[correctResponse.id] = true;
      correct++;
    } else {
      answerInfo[correctResponse.id] = false;
    }
  });

  return {
    info: answerInfo,
    count: correct,
  };
}

const getCorrectness = (question, env, answers) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      answers
    );
  }
};

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      config: {
        ...defaults,
        ...model
      }
    });
  });
}

export function model(question, session, env) {
  return new Promise(resolve => {
    const correctness = getCorrectness(question, env, session.answers);
    const correctResponse = {};

    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        config: question,
        correctness,
        feedback,
        disabled: env.mode !== 'gather',
        view: env.mode === 'view'
      };

      const out = Object.assign(base, {
        correctResponse
      });
      log('out: ', out);
      resolve(out);
    });
  });
}
