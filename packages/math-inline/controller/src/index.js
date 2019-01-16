import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { areValuesEqual } from '@pie-lib/math-evaluator';

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

  if (correctResponses === correctAnswers) {
    return  'correct';
  } else if (correctAnswers === 0) {
    return 'incorrect';
  }

  return 'incorrect';
};

function getCorrectAnswers(correctResponses, answers) {
  let correct = 0;

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
      correct++;
    }
  });

  return correct;
}

const getCorrectness = (question, env, answers) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      answers
    );
  }
};

export function model(question, session, env) {
  return new Promise(resolve => {
    const correctness = getCorrectness(question, env, session.answers);
    const correctResponse = {};
    const correctInfo = {
      correctness
    };

    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctInfo.correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        config: question,
        correctness: correctInfo,
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
