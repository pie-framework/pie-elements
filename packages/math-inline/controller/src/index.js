import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import areValuesEqual from '@pie-lib/math-evaluator';
import { ResponseTypes } from './utils';

import defaults from './defaults';

const log = debug('@pie-element:math-inline:controller');
const decimalRegex = /\.|,/g;
const decimalCommaRegex = /,/g;
const textRegex = /\\text\{([^{}]+)\}/g;
const decimalWithThousandSeparatorNumberRegex = /^(?!0+\.00)(?=.{1,9}(\.|$))(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?$/;

function trimSpaces(str = '') {
  return str.replace(/\\ /g, '').replace(/ /g, '');
}

function processAnswerItem(answerItem = '') {
  // looks confusing, but we're replacing U+002D and U+2212 (minus and hyphen) so we have the same symbol everywhere consistently
  // further processing is to be added here if needed
  let newAnswerItem = answerItem.replace('−', '-');

  newAnswerItem = newAnswerItem.replace('\\cdot', '\\times');

  // also ignore text nodes, just swap out with content

  newAnswerItem = newAnswerItem.replace(textRegex, '$1');

  return newAnswerItem;
}

function containsDecimal(expression = '') {
  return expression.match(decimalRegex);
}

const getResponseCorrectness = (model, answerItem, isOutcome) => {
  const correctResponses = model.responses;
  const isAdvanced = model.responseType === ResponseTypes.advanced;

  if (!answerItem) {
    return {
      correctness: 'unanswered',
      score: isOutcome ? 0 : '0%',
      correct: false
    };
  }

  const isAnswerCorrect = getIsAnswerCorrect(
    isAdvanced ? correctResponses : correctResponses.slice(0, 1),
    answerItem
  );
  const correctnessObject = {
    correctness: 'incorrect',
    score: isOutcome ? 0 : '0%',
    correct: false
  };

  if (isAnswerCorrect) {
    correctnessObject.correctness = 'correct';
    correctnessObject.score = isOutcome ? 1 : '100%';
    correctnessObject.correct = true;
  }

  return correctnessObject;
};

function getIsAnswerCorrect(correctResponseItem, answerItem) {
  let answerCorrect = false;

  correctResponseItem.forEach(correctResponse => {
    const acceptedValues = [correctResponse.answer].concat(
      Object.keys(correctResponse.alternates || {}).map(
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
            answerValueToUse = answerValueToUse.replace(decimalCommaRegex, '');
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
      answerCorrect = areValuesEqual(
        processAnswerItem(correctResponse.answer),
        processAnswerItem(answerItem),
        {
          isLatex: true,
          allowDecimals: correctResponse.allowDecimals
        }
      );
    }
  });

  return answerCorrect;
}

const getCorrectness = (question, env, session, isOutcome) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      question.responseType === ResponseTypes.advanced
        ? (session && session.completeAnswer) || ''
        : session && session.response,
      isOutcome
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
      if (!session || isEmpty(session)) {
        resolve({ score: 0, empty: true });
      } else {
        const correctness = getCorrectness(question, env, session, true);

        resolve({ score: correctness.score });
      }
    }
  });
};

export const normalize = question => ({
  feedbackEnabled: true,
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

export function model(question, session, env) {
  return new Promise(resolve => {
    const normalizedQuestion = normalize(question);
    const correctness = getCorrectness(normalizedQuestion, env, session);
    const correctResponse = {};
    const { responses, ...config } = normalizedQuestion;

    if (config.responseType === ResponseTypes.simple) {
      config.responses = responses.slice(0, 1);
    } else {
      config.responses = responses;
    }

    const fb =
      env.mode === 'evaluate' && normalizedQuestion.feedbackEnabled
        ? getFeedbackForCorrectness(correctness, normalizedQuestion.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        config,
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
        out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
        out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
          ? normalizedQuestion.teacherInstructions
          : null;
      } else {
        out.rationale = null;
        out.teacherInstructions = null;
      }

      out.config.prompt = normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null;

      log('out: ', out);
      resolve(out);
    });
  });
}

// This method supports simple equations only, eg: 3x + 1 = 4
export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { responses } = question;
      const { answer } = responses ? responses[0] : {};
      const equalIndex = answer && answer.indexOf('=');

      resolve({
        answers: {
          r1: { value: answer.substring(0, equalIndex) },
          r2: { value: answer.substring(equalIndex + 1, answer.length) }
        },
        completeAnswer: answer,
        response: answer, // used for simple mode
        id: '1'
      });
    } else {
      resolve(null);
    }
  });
};
