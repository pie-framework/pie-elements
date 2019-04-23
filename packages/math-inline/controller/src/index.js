import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import areValuesEqual from '@pie-lib/math-evaluator';
import { ResponseTypes } from './utils';

import defaults from './defaults';

const log = debug('@pie-element:math-inline:controller');

function trimSpaces(str = '') {
  return str.replace(/\\ /g, '').replace(/ /g, '');
}

const getResponseCorrectness = (model, answerItem) => {
  const correctResponses = model.responses;
  const isAdvanced = model.responseType === ResponseTypes.advanced;

  if (!answerItem) {
    return {
      correctness: 'unanswered',
      score: '0%',
      correct: false
    };
  }

  const isAnswerCorrect = getIsAnswerCorrect(
    isAdvanced ? correctResponses : model.response,
    answerItem,
    isAdvanced
  );
  const correctnessObject = {
    correctness: 'incorrect',
    score: '0%',
    correct: false
  };

  if (isAnswerCorrect) {
    correctnessObject.correctness = 'correct';
    correctnessObject.score = '100%';
    correctnessObject.correct = true;
  }

  return correctnessObject;
};

function getIsAnswerCorrect(correctResponseItem, answerItem, isAdvanced) {
  let answerCorrect = false;

  if (isAdvanced) {
    correctResponseItem.forEach(correctResponse => {

      const acceptedValues = [correctResponse.answer].concat(
        Object.keys(correctResponse.alternates).map(
          alternateId => correctResponse.alternates[alternateId]
        )
      );

      if (correctResponse.validation === 'literal') {
        for (let i = 0; i < acceptedValues.length; i++) {
          if (acceptedValues[i] === (correctResponse.allowSpaces ? trimSpaces(answerItem) : answerItem)) {
            answerCorrect = true;
            break;
          }
        }
      } else {
        answerCorrect = areValuesEqual(
          correctResponse.answer,
          answerItem,
          { isLatex: true, allowDecimals: correctResponse.allowDecimals }
        );
      }
    });
  } else {
    const acceptedValues = [correctResponseItem.answer].concat(
      Object.keys(correctResponseItem.alternates).map(
        alternateId => correctResponseItem.alternates[alternateId]
      )
    );

    if (correctResponseItem.validation === 'literal') {
      for (let i = 0; i < acceptedValues.length; i++) {
        if (acceptedValues[i] === answerItem) {
          answerCorrect = true;
          break;
        }
      }
    } else {
      answerCorrect = areValuesEqual(correctResponseItem.answer, answerItem, {
        isLatex: true,
        allowDecimals: correctResponseItem.allowDecimals
      });
    }
  }

  return answerCorrect;
}

const getCorrectness = (question, env, session) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      question.responseType === ResponseTypes.advanced ? session.completeAnswer || '': session.response
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
    const correctness = getCorrectness(
      question,
      env,
      session
    );
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
