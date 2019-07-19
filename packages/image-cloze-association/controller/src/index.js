import debug from 'debug';
import { camelizeKeys } from 'humps';

const log = debug('pie-elements:image-cloze-association:controller');

import { getNumberOfDuplicates } from './utils';

export function model(question, session, env) {
  const questionCamelized = camelizeKeys(question);

  return new Promise(resolve => {
    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      ...questionCamelized,
      responseCorrect:
        env.mode === 'evaluate'
          ? isDefaultOrAltResponseCorrect(questionCamelized, session)
          : undefined,
    };


    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.teacherInstructions = question.teacherInstructions;
    } else {
      out.teacherInstructions = null;
    }

    resolve(out);
  });
}

const isResponseCorrect = (responses, session) => {
  let isCorrect = true;
  let totalValidResponses = 0;

  responses.forEach(value => totalValidResponses += value.length);

  if (session.answers && totalValidResponses === session.answers.length) {
    session.answers.forEach(answer => {
      if (!responses[answer.containerIndex].includes(answer.value)) {
        isCorrect = false;
      }
    });
  } else {
    isCorrect = false;
  }
  return isCorrect;
};

const isDefaultOrAltResponseCorrect = (question, session) => {
  const { validation: { validResponse: { value }, altResponses } } = question;

  let isCorrect = isResponseCorrect(value, session);

  // Look for correct answers in alternate responses.
  if (!isCorrect && (altResponses && altResponses.length)) {
    altResponses.forEach(altResponse => {
      if (isResponseCorrect(altResponse.value, session)) {
        isCorrect = true;
      }
    })
  }
  return isCorrect;
};

const getPartialScore = (question, session) => {
  const { validation: { validResponse }, maxResponsePerZone, responseContainers } = question;
  let correctAnswers = 0;
  let totalValidResponses = 0;

  validResponse.value.forEach(value => totalValidResponses += value.length);

  if (session.answers && session.answers.length) {
    session.answers.forEach(answer => {
      if (validResponse.value[answer.containerIndex].includes(answer.value)) {
        correctAnswers += 1;
      } else if (maxResponsePerZone > 1) {
        correctAnswers -= 1;
      }
    });
  } else {
    correctAnswers = 0;
  }
  // negative values will implicitly make the score equal to zero
  correctAnswers = correctAnswers < 0 ? 0 : correctAnswers;
  const duplicates = getNumberOfDuplicates(session.answers, validResponse.value);

  const uniqueCorrectAnswers = correctAnswers - (duplicates) * 2; // times two because 'correctAnswers' might have duplicates
  correctAnswers = uniqueCorrectAnswers < 0 ? 0 : uniqueCorrectAnswers;

  const denominator = maxResponsePerZone > 1 ? totalValidResponses : responseContainers.length;
  const str = (correctAnswers / denominator).toFixed(2);

  return parseFloat(str);
};

const getScore = (config, session) => {
  const { partialScoring } = config;
  const correct = isDefaultOrAltResponseCorrect(config, session);

  return partialScoring ? getPartialScore(config, session) : (correct ? 1 : 0);
};

export function outcome(config, session, env) {
  return new Promise(resolve => {
    log('outcome...');
    const configCamelized = camelizeKeys(config);

    if (session.answers || []) {
      const score = getScore(configCamelized, session, env);
      resolve({ score });
    }
  });
}
