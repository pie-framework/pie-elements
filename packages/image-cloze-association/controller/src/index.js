import debug from 'debug';
import { camelizeKeys } from 'humps';
import { partialScoring } from '@pie-lib/controller-utils';
import { cloneDeep, isEmpty, shuffle } from 'lodash';

import defaults from './defaults';
import { getAllUniqueCorrectness, getCompleteResponseDetails } from './utils';

const log = debug('pie-elements:image-cloze-association:controller');

export const normalize = (question) => ({ ...defaults, ...question });

export const model = (question, session, env) => {
  const questionNormalized = normalize(question);
  const questionCamelized = camelizeKeys(questionNormalized);

  return new Promise((resolve) => {
    const shouldIncludeCorrectResponse = env.mode === 'evaluate';

    const {
      responseAreasToBeFilled,
      possibleResponses: completeResponses,
      hasUnplacedChoices,
    } = getCompleteResponseDetails(questionCamelized.validation, questionCamelized.possibleResponses);

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      ...questionCamelized,
      responseCorrect: shouldIncludeCorrectResponse ? getScore(questionCamelized, session) === 1 : undefined,
      validation: shouldIncludeCorrectResponse ? questionCamelized.validation : undefined,
      responseAreasToBeFilled,
      completeResponses,
      hasUnplacedChoices,
    };

    if (questionNormalized.shuffle) {
      out.possibleResponses = shuffle(questionNormalized.possible_responses);
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.teacherInstructions = questionCamelized.teacherInstructionsEnabled
        ? questionCamelized.teacherInstructions
        : null;
      out.rationale = questionCamelized.rationale ? questionCamelized.rationale : null;
    } else {
      out.teacherInstructions = null;
      out.rationale = null;
    }

    resolve(out);
  });
};

export const isResponseCorrect = (correctResponses, session) => {
  const responses = cloneDeep(correctResponses);
  let isCorrect = true;
  let totalValidResponses = 0;

  if (!session || isEmpty(session)) {
    return false;
  }

  responses.forEach((value) => (totalValidResponses += (value.images || []).length));

  if (session.answers && totalValidResponses === session.answers.length) {
    session.answers.forEach((answer) => {
      const index = (responses[answer.containerIndex]?.images || []).indexOf(answer.value);

      if (index >= 0) {
        // remove response from correct responses array to ensure that duplicates are evaluated correctly
        responses[answer.containerIndex].images.splice(index, 1);
      } else {
        isCorrect = false;
      }
    });
  } else {
    isCorrect = false;
  }

  return isCorrect;
};

// This applies for correct responses that have empty values
const keepNonEmptyResponses = (responses) => {
  const filtered = responses.filter((response) => response.images && response.images.length);
  return cloneDeep(filtered);
};

// This applies for items that don't support partial scoring.
const isDefaultOrAltResponseCorrect = (question, session) => {
  const {
    validation: { altResponses },
  } = question;
  let {
    validation: {
      validResponse: { value },
    },
  } = question;

  let isCorrect = isResponseCorrect(value, session);

  // Look for correct answers in alternate responses.
  if (!isCorrect && altResponses && altResponses.length) {
    altResponses.forEach((altResponse) => {
      if (isResponseCorrect(altResponse.value, session)) {
        isCorrect = true;
      }
    });
  }
  return isCorrect;
};

// Deduct only the items that exceeded the maximum valid response per container.
const getDeductionPerContainer = (containerIndex, answers, valid) => {
  const totalStack = answers.filter((item) => item.containerIndex === containerIndex);
  const incorrectStack = totalStack.filter((item) => !item.isCorrect);
  const maxValid = (valid.value[containerIndex].images || []).length;

  if (totalStack.length > maxValid) {
    const ignored = totalStack.length - maxValid;
    return incorrectStack.slice(-ignored);
  }
  return [];
};

export const getPartialScore = (question, session) => {
  const {
    validation: { validResponse },
    maxResponsePerZone,
  } = question;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let possibleResponses = 0;

  if (!session || isEmpty(session)) {
    return 0;
  }

  validResponse.value.forEach((value) => (possibleResponses += (value.images || []).length));

  if (session.answers && session.answers.length) {
    const all = getAllUniqueCorrectness(session.answers, validResponse.value);
    correctAnswers = all.filter((item) => item.isCorrect).length;
    incorrectAnswers = all.filter((item) => !item.isCorrect).length;

    // deduction rules: https://docs.google.com/document/d/1Oprm8Qs5fg_Dwoj2pNpsfu4D63QgCZgvcqTgeaVel7I/edit
    session.answers.forEach((answer) => {
      if (maxResponsePerZone > 1) {
        const deductionList = getDeductionPerContainer(answer.containerIndex, all, validResponse);

        if (deductionList.length) {
          deductionList.forEach((item) => {
            if (item.id === answer.id) {
              correctAnswers -= 1;
            }
          });
        }
      }
    });

    if (!maxResponsePerZone || maxResponsePerZone <= 1) {
      correctAnswers -= incorrectAnswers;
    }
  } else {
    correctAnswers = 0;
  }
  // negative values will implicitly make the score equal to zero
  correctAnswers = correctAnswers < 0 ? 0 : correctAnswers;

  // use length of validResponse since some containers can be left empty
  const nonEmptyResponses = keepNonEmptyResponses(validResponse.value);
  const denominator = maxResponsePerZone > 1 ? possibleResponses : (nonEmptyResponses || []).length;
  const str = (correctAnswers / denominator).toFixed(2);

  return parseFloat(str);
};

const getScore = (config, session, env = {}) => {
  const isPartialScoring = partialScoring.enabled(config, env);
  const correct = isDefaultOrAltResponseCorrect(config, session);

  return isPartialScoring ? getPartialScore(config, session) : correct ? 1 : 0;
};

/**
 * Generates detailed trace log for scoring evaluation
 * @param {Object} model - the question model
 * @param {Object} session - the student session
 * @param {Object} env - the environment
 * @returns {Array} traceLog - array of trace messages
 */
export const getLogTrace = (model, session, env) => {
  const traceLog = [];
  const { answers } = session || {};
  
  const validResponse = model.validation?.validResponse?.value || [];
  const totalContainers = validResponse.length;
  traceLog.push(`${totalContainers} placement container(s) defined in this question.`);

  if (answers && answers.length > 0) {
    traceLog.push(`Student placed ${answers.length} image(s) into placement containers.`);
    
    const answersByContainer = {};
    answers.forEach((answer) => {
      if (!answersByContainer[answer.containerIndex]) {
        answersByContainer[answer.containerIndex] = [];
      }
      answersByContainer[answer.containerIndex].push(answer.value);
    });
    
    validResponse.forEach((container, containerIndex) => {
      const correctImages = container.images || [];
      const studentImages = answersByContainer[containerIndex] || [];
      
      if (correctImages.length > 0) {
        if (studentImages.length === 0) {
          traceLog.push(`Container ${containerIndex + 1}: student left empty (should contain ${correctImages.length} image(s)).`);
        } else {
          const correctCount = studentImages.filter(img => correctImages.includes(img)).length;
          const incorrectCount = studentImages.length - correctCount;
          
          if (correctCount > 0 && incorrectCount === 0) {
            traceLog.push(`Container ${containerIndex + 1}: student placed ${correctCount} correct image(s).`);
          } else if (correctCount === 0 && incorrectCount > 0) {
            traceLog.push(`Container ${containerIndex + 1}: student placed ${incorrectCount} incorrect image(s).`);
          } else {
            traceLog.push(`Container ${containerIndex + 1}: student placed ${correctCount} correct and ${incorrectCount} incorrect image(s).`);
          }
        }
      }
    });
  } else {
    traceLog.push('Student did not place any images into placement containers.');
  }

  const altResponses = model.validation?.altResponses || [];
  if (altResponses.length > 0) {
    traceLog.push(`${altResponses.length} alternate response combination(s) are accepted for this question.`);
  }

  const partialScoringEnabled = partialScoring.enabled(model, env);
  const scoringMethod = partialScoringEnabled ? 'partial scoring' : 'all-or-nothing scoring';
  traceLog.push(`Score calculated using ${scoringMethod}.`);

  const score = getScore(model, session, env);
  traceLog.push(`Final score: ${score}.`);

  return traceLog;
}

export const outcome = (config, session, env = {}) => {
  return new Promise((resolve) => {
    log('outcome...');
    if (!session || isEmpty(session)) {
      resolve({ 
        score: 0, 
        empty: true, 
        traceLog: ['Student did not place any images into placement containers. Score is 0.'] 
      });
    } else {
      const configCamelized = camelizeKeys(config);
      const traceLog = getLogTrace(configCamelized, session, env);
      const score = getScore(configCamelized, session, env);
      
      resolve({ 
        score, 
        empty: false,
        traceLog 
      });
    }
  });
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const {
        validation: {
          valid_response: { value },
        },
      } = question;
      const answers = [];

      if (value) {
        value.forEach((container, i) => {
          (container.images || []).forEach((v) => {
            answers.push({
              value: v,
              containerIndex: i,
            });
          });
        });
      }

      resolve({
        answers,
        id: '1',
      });
    } else {
      resolve(null);
    }
  });
};

// remove all html tags
const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

// remove all html tags except img, iframe and source tag for audio
const getContent = (html) => (html || '').replace(/(<(?!img|iframe|source)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const errors = {};

  ['teacherInstructions'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  return errors;
};
