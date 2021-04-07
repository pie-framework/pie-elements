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
const noNumbers = /[^0-9.,]+/g;

/**
 * TODO:
 *
 * We have `stringCheck` which if true disabled 'literal' and 'symbolic' so really it should be a validation method. And if it is what's the difference between it and 'literal'?
 *
 * We should support a equivalence option per correct response like:
 * responses: [ { answer: '..', validation: 'symbolic', alternates: [{ value: '..', validation: 'stringCompare'}, 'abc'] } ]
 *
 * if option is a string it is turned into an object w/ inherited opts.
 *
 * This would override any shared setting at the root.
 */

function processAnswerItem(answerItem = '', isLiteral) {
  // looks confusing, but we're replacing U+002D and U+2212 (minus and hyphen) so we have the same symbol everywhere consistently
  // further processing is to be added here if needed
  let newAnswerItem = answerItem.replace('−', '-');

  newAnswerItem = newAnswerItem.replace(/\\cdot/g, '\\times');

  // also ignore text nodes, just swap out with empty string

  newAnswerItem = newAnswerItem.replace(textRegex, '');
  if (
    containsDecimal(newAnswerItem) && validExpressionWithThousandSeparator(newAnswerItem)
  ) {
    newAnswerItem = newAnswerItem.replace(decimalCommaRegex, '');
  }

  newAnswerItem = newAnswerItem.replace(/\\ /g, '').replace(/ /g, '');

  // eslint-disable-next-line no-useless-escape
  newAnswerItem = newAnswerItem
    .replace(/\\%/g, '')
    .replace(/%/g, '');

  return isLiteral ? stripForStringCompare(newAnswerItem) : newAnswerItem;
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

  let allowTrailingZeros = false;

  (model.responses || []).forEach(response => {
      allowTrailingZeros = allowTrailingZeros || response.allowTrailingZeros;
  });

  const isAnswerCorrect = getIsAnswerCorrect(
    isAdvanced ? correctResponses : correctResponses.slice(0, 1),
    answerItem,
    allowTrailingZeros
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

const stripTargets = [
  /{/g,
  /}/g,
  /\[/g,
  /]/g,
  /\\ /g,
  /\\/g,
  /\\s/g,
  /left/g,
  /right/g,
  / /g
];

const validExpressionWithThousandSeparator = (answer) => {
  const numericValues = answer.split(noNumbers);

  for (let i = 0; i < numericValues.length; i++) {
    if (numericValues[i] != '' && containsDecimal(numericValues[i]) && !decimalWithThousandSeparatorNumberRegex.test(numericValues[i])) {

      return false;
    }
  }

  return true
}

function stripForStringCompare(answer = '') {
  let stripped = answer;

  stripTargets.forEach(stripTarget => {
    return (stripped = stripped.replace(stripTarget, ''));
  });

  return stripped;
}

function removeTrailingZeros(answer = '') {
  return answer.replace(/(((?<=(\.)\d*?[1-9])0+)|(\.)0+)/g, '');
}

function handleStringBasedCheck(acceptedValues, answerItem) {
  let answerValueToUse = processAnswerItem(answerItem, true);
  let answerCorrect = false;

  for (let i = 0; i < acceptedValues.length; i++) {
    let acceptedValueToUse = processAnswerItem(acceptedValues[i], true);

    answerCorrect = answerValueToUse === acceptedValueToUse;

    if (answerCorrect === true) {
      break;
    }
  }

  return answerCorrect;
}

function getIsAnswerCorrect(correctResponseItem, answerItem, allowTrailingZeros) {
  let answerCorrect = false;

  correctResponseItem.forEach(correctResponse => {
    // if not already deemed correct for one of the correct responses
    if (!answerCorrect) {
      const acceptedValues = [correctResponse.answer].concat(
        Object.keys(correctResponse.alternates || {}).map(
          alternateId => correctResponse.alternates[alternateId]
        )
      );

      if (correctResponse.validation === 'literal') {
        for (let i = 0; i < acceptedValues.length; i++) {
          let answerValueToUse = processAnswerItem(answerItem, true);
          let acceptedValueToUse = processAnswerItem(acceptedValues[i], true);

          if (allowTrailingZeros) {
            acceptedValueToUse = removeTrailingZeros(acceptedValueToUse);
            answerValueToUse = removeTrailingZeros(answerValueToUse);
          }

          if (acceptedValueToUse === answerValueToUse) {
            answerCorrect = true;
            break;
          }
        }
      } else {
        try {
          for (let i = 0; i < acceptedValues.length; i++) {
            // let answerValueToUse = processAnswerItem(answerItem);
            // let acceptedValueToUse = processAnswerItem(acceptedValues[i]);

            answerCorrect = areValuesEqual(
              processAnswerItem(acceptedValues[i]),
              processAnswerItem(answerItem),
              {
                isLatex: true,
                allowThousandsSeparator: correctResponse.allowThousandsSeparator
              }
            );
            if (answerCorrect) {
              break;
            }
          }
        } catch (e) {
          log(
            'Parse failure when evaluating math',
            e,
            correctResponse,
            answerItem
          );
          // try to string check compare, last resort?
          // once invalid models have been weeded out, this'll get removed.
          answerCorrect = handleStringBasedCheck(acceptedValues, answerItem);
        }
      }
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
  ...question
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

      let out;

      if (env.mode === 'evaluate') {
        out = Object.assign(base, {
          correctResponse
        });
      } else {
        out = base;

        out.config.responses = [];
      }

      if (
        env.role === 'instructor' &&
        (env.mode === 'view' || env.mode === 'evaluate')
      ) {
        out.rationale = normalizedQuestion.rationaleEnabled
          ? normalizedQuestion.rationale
          : null;
        out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
          ? normalizedQuestion.teacherInstructions
          : null;
      } else {
        out.rationale = null;
        out.teacherInstructions = null;
        out.config.rationale = null;
        out.config.teacherInstructions = null;
      }

      out.config.prompt = normalizedQuestion.promptEnabled
        ? normalizedQuestion.prompt
        : null;

      log('out: ', out);
      resolve(out);
    });
  });
}

const escape = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

const simpleSessionResponse = question =>
  new Promise(resolve => {
    const { responses } = question;
    const { answer } = responses ? responses[0] : {};
    resolve({
      id: question.id,
      response: answer,
      completeAnswer: answer
    });
  });

const advancedSessionResponse = question =>
  new Promise((resolve, reject) => {
    const { responses } = question;
    const { answer } = responses ? responses[0] : {};

    try {
      const e = question.expression;
      const RESPONSE_TOKEN = /\\{\\{\s*response\s*\\}\\}/g;

      const o = escape(e).split(RESPONSE_TOKEN);
      const to = o.map(t => (t === '' ? t : t.replace(/\s+/g, () => ('\\s*'))));
      const tt = to.join('(.*)');

      const m = answer.match(new RegExp(tt));

      const count = o.length - 1;

      if (!m) {
        resolve({
          answers: {},
          completeAnswer: answer,
          id: question.id
        });

        console.log(`can not find match: ${o} in ${answer}`);

        return;
      }

      m.shift();

      const answers = {};

      for (var i = 0; i < count; i++) {
        answers[`r${i + 1}`] = { value: m[i].trim() };
      }

      resolve({
        answers,
        completeAnswer: answer,
        id: question.id
      });
    } catch (e) {
      resolve({
        answers: {},
        completeAnswer: answer,
        id: question.id
      });

      console.error(e.toString());
    }
  });


export const createCorrectResponseSession = (question, env) => {
  if (env.mode === 'evaluate' || env.role !== 'instructor') {
    // eslint-disable-next-line no-console
    console.error(
      'can not create correct response session if mode is evaluate or role is not instructor'
    );

    return Promise.resolve(null);
  }

  if ((question.responseType || '').toLowerCase() === 'simple') {
    return simpleSessionResponse(question, env);
  } else {
    return advancedSessionResponse(question, env);
  }
};
