import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import areValuesEqual from '@pie-lib/math-evaluator';
import { ResponseTypes } from './utils';

import defaults from './defaults';

const log = debug('@pie-element:math-inline:controller');
const decimalRegex = /\.|,/g;
const decimalCommaRegex = /,/g;
const decimalWithThousandSeparatorNumberRegex = /^(?!0+\.00)(?=.{1,9}(\.|$))(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?$/;

function trimSpaces(str = '') {
  return str.replace(/\\ /g, '').replace(/ /g, '');
}

function processAnswerItem(answerItem = '') {
  // looks confusing, but we're replacing U+002D and U+2212 (minus and hyphen) so we have the same symbol everywhere consistently
  // further processing is to be added here if needed
  return answerItem.replace('−', '-');
}

function containsDecimal(expression = '') {
  return expression.match(decimalRegex);
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
          let answerValueToUse = processAnswerItem(answerItem);
          let acceptedValueToUse = processAnswerItem(acceptedValues[i]);

          if (correctResponse.allowDecimals) {
            if (
              containsDecimal(answerValueToUse) &&
              decimalWithThousandSeparatorNumberRegex.test(answerValueToUse)
            ) {
              answerValueToUse = answerValueToUse.replace(
                decimalCommaRegex,
                ''
              );
            }

            if (
              containsDecimal(acceptedValueToUse) &&
              decimalWithThousandSeparatorNumberRegex.test(acceptedValueToUse)
            ) {
              acceptedValueToUse = acceptedValueToUse.replace(
                decimalCommaRegex,
                ''
              );
            }
          }

          if (correctResponse.allowSpaces) {
            if (
              acceptedValueToUse === trimSpaces(answerValueToUse) ||
              acceptedValueToUse === answerValueToUse ||
              trimSpaces(acceptedValueToUse) === trimSpaces(answerValueToUse)
            ) {
              answerCorrect = true;
              break;
            }
          } else if (acceptedValueToUse === answerValueToUse) {
            answerCorrect = true;
            break;
          }
        }
      } else {
        answerCorrect = areValuesEqual(correctResponse.answer, answerItem, {
          isLatex: true,
          allowDecimals: correctResponse.allowDecimals
        });
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
      question.responseType === ResponseTypes.advanced
        ? session.completeAnswer || ''
        : session.response
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

export const outcome = (question, session, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      const correctness = getCorrectness(question, env, session);

      const out = {
        score: correctness.score
      };

      resolve(out);
    }
  });
};

export function model(question, session, env) {
  return new Promise(resolve => {
    const correctness = getCorrectness(question, env, session);
    const correctResponse = {};

    const fb =
      env.mode === 'evaluate' && question.allowFeedback
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

      if (
        env.role === 'instructor' &&
        (env.mode === 'view' || env.mode === 'evaluate')
      ) {
        out.rationale = question.rationale;
        out.teacherInstructions = question.teacherInstructions;
      } else {
        out.rationale = null;
        out.teacherInstructions = null;
      }

      log('out: ', out);
      resolve(out);
    });
  });
}

// This method supports simple equations only, eg: 3x + 1 = 4
export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { response: { answer } } = question;
      const equalIndex = answer.indexOf('=');

      resolve({
        answers: {
          r1: { value: answer.substring(0, equalIndex) },
          r2: { value: answer.substring(equalIndex, answer.length) }
        },
        completeAnswer: answer,
        id: '1'
      });
    }
  });
};
