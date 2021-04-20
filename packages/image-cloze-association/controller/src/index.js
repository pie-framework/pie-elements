import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import { camelizeKeys } from 'humps';
import { partialScoring } from '@pie-lib/controller-utils';

import { getAllUniqueCorrectness } from './utils';

const log = debug('pie-elements:image-cloze-association:controller');

export const normalize = question => ({
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

export function model(question, session, env) {
  const questionNormalized = normalize(question);
  const questionCamelized = camelizeKeys(questionNormalized);

  return new Promise(resolve => {
    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      ...questionCamelized,
      responseCorrect:
        env.mode === 'evaluate'
          ? getScore(questionCamelized, session) === 1
          : undefined,
    };

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.teacherInstructions = questionCamelized.teacherInstructionsEnabled ? questionCamelized.teacherInstructions : null;
    } else {
      out.teacherInstructions = null;
    }

    resolve(out);
  });
}

export const isResponseCorrect = (responses, session) => {
  let isCorrect = true;
  let totalValidResponses = 0;

  if (!session || isEmpty(session)) {
    return false;
  }

  responses.forEach(value => totalValidResponses += value.images.length);

  if (session.answers && totalValidResponses === session.answers.length) {
    session.answers.forEach(answer => {
      if (!responses[answer.containerIndex].images.includes(answer.value)) {
        isCorrect = false;
      }
    });
  } else {
    isCorrect = false;
  }
  return isCorrect;
};

// This applies for items that don't support partial scoring.
const isDefaultOrAltResponseCorrect = (question, session) => {
  const { validation: { validResponse: { value }, altResponses } } = question;

  let isCorrect = isResponseCorrect(value, session);

  // Look for correct answers in alternate responses.
  if (!isCorrect && (altResponses && altResponses.length)) {
    altResponses.forEach(altResponse => {
      if (isResponseCorrect(altResponse.value, session)) {
        isCorrect = true;
      }
    });
  }
  return isCorrect;
};

// Deduct only the items that exceeded the maximum valid response per container.
const getDeductionPerContainer = (containerIndex, answers, valid) => {
  const totalStack = answers.filter(item => item.containerIndex === containerIndex);
  const incorrectStack = totalStack.filter(item => !item.isCorrect);
  const maxValid = valid.value[containerIndex].length;

  if (totalStack.length > maxValid) {
    const ignored = totalStack.length - maxValid;
    return incorrectStack.slice(-ignored);
  }
  return [];
};

export const getPartialScore = (question, session) => {
  const { validation: { validResponse }, maxResponsePerZone, responseContainers } = question;
  let correctAnswers = 0;
  let possibleResponses = 0;

  if (!session || isEmpty(session)) {
    return 0;
  }

  validResponse.value.forEach(value => possibleResponses += value.length);

  if (session.answers && session.answers.length) {
    const all = getAllUniqueCorrectness(session.answers, validResponse.value);
    correctAnswers = all.filter(item => item.isCorrect).length;

    // deduction rules: https://docs.google.com/document/d/1Oprm8Qs5fg_Dwoj2pNpsfu4D63QgCZgvcqTgeaVel7I/edit
    session.answers.forEach(answer => {
      if (maxResponsePerZone > 1) {
        const deductionList = getDeductionPerContainer(answer.containerIndex, all, validResponse);

        if (deductionList.length) {
          deductionList.forEach(item => {
            if (item.id === answer.id) {
              correctAnswers -= 1;
            }
          });
        }
      }
    });
  } else {
    correctAnswers = 0;
  }
  // negative values will implicitly make the score equal to zero
  correctAnswers = correctAnswers < 0 ? 0 : correctAnswers;

  const denominator = maxResponsePerZone > 1 ? possibleResponses : responseContainers.length;
  const str = (correctAnswers / denominator).toFixed(2);

  return parseFloat(str);
};

const getScore = (config, session, env = {}) => {
  const isPartialScoring = partialScoring.enabled(config, env);
  const correct = isDefaultOrAltResponseCorrect(config, session);

  return isPartialScoring ? getPartialScore(config, session) : (correct ? 1 : 0);
};

export function outcome(config, session, env = {}) {
  return new Promise(resolve => {
    log('outcome...');
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    const configCamelized = camelizeKeys(config);

    if (session.answers || []) {
      const score = getScore(configCamelized, session, env);
      resolve({ score });
    }
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { validation: { valid_response: { value } } } = question;
      const answers = [];

      if (value) {
        value.forEach((container, i) => {
          container.forEach(v => {
            answers.push({
              value: v,
              containerIndex: i
            });
          });
        });
      }

      resolve({
        answers,
        id: '1'
      });
    } else {
      resolve(null);
    }
  });
};
