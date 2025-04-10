import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isEqualWith from 'lodash/isEqualWith';
import merge from 'lodash/merge';
import omitBy from 'lodash/omitBy';
import { getFeedbackForCorrectness } from '@pie-lib/pie-toolbox/feedback';
import { partialScoring } from '@pie-lib/pie-toolbox/controller-utils';
import * as math from 'mathjs';

import defaults from './defaults';
import { reloadTicksData } from './utils';

const score = (number) => {
  return {
    score: {
      scaled: number,
    },
  };
};

const getPartialScore = (corrected, ps) => {
  const { correct } = corrected;
  const rule = ps.find((r) => r.numberOfCorrect === correct.length);

  if (rule) {
    return 1.0 * (rule.scorePercentage / 100);
  } else {
    return 0;
  }
};

const accumulateAnswer = (correctResponse) => (total, answer) => {
  const isCorrectResponse = correctResponse.some((cr) => matches(cr)(answer));
  return total + (isCorrectResponse ? 1 : 0);
};

/**
 */
export function outcome(model, session, env) {
  return new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    } else {
      const partialScoringEnabled = partialScoring.enabled(model, env);
      const numCorrect = (session.answer || []).reduce(accumulateAnswer(model.correctResponse), 0);

      let total = model.correctResponse.length;
      let numIncorrect = 0;

      if ((session.answer || []).length > total) {
        numIncorrect = (session.answer || []).length - total;
      }

      if (total === 0) {
        total = 1;
      }

      let score = numCorrect < 0 ? 0 : (numCorrect - numIncorrect) / total;

      if (score < 0) {
        score = 0;
      }

      resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0 });
    }
  });
}

export function getScore(question, session) {
  return new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ score: { scaled: 0 } });
    } else {
      session.answer = session.answer || [];

      const corrected = getCorrected(session.answer, cloneDeep(question.correctResponse));

      const correctness = getCorrectness(corrected);

      if (correctness === 'correct') {
        resolve(score(1.0));
      } else if (correctness === 'incorrect') {
        resolve(score(0.0));
      } else if (correctness === 'partial') {
        const { allowPartialScoring, partialScoring } = question;
        const ps = (partialScoring || []).filter((o) => !isEmpty(o));
        const canDoPartialScoring = allowPartialScoring && ps.length > 0;
        if (canDoPartialScoring) {
          resolve(score(getPartialScore(corrected, ps)));
        } else {
          resolve(score(0.0));
        }
      } else {
        resolve({ score: { scaled: -1 } });
      }
    }
  });
}

export const CLOSE_TO_PRECISION = 3;

export const closeTo = (a, b, precision) => {
  precision = precision || 5;
  const expectedDiff = Math.pow(10, -precision) / 2;
  const receivedDiff = Math.abs(a - b);
  const close = receivedDiff <= expectedDiff;
  return close;
};

const matches = (a) => (v) => {
  return isEqualWith(a, v, (v, ov) => {
    if (typeof v === 'number' && typeof ov === 'number') {
      return closeTo(v, ov, CLOSE_TO_PRECISION);
    }
  });
};

export const getCorrected = (answer, correctResponse) => {
  if (isEmpty(correctResponse) && answer.length > 0) {
    return {
      correct: [],
      incorrect: [],
      notInAnswer: [],
      noCorrectResponse: true,
    };
  }

  return answer.reduce(
    (acc, a, index) => {
      const { correct, incorrect, notInAnswer } = acc;

      const match = find(notInAnswer, matches(a));
      if (match) {
        correct.push(index);
        notInAnswer.splice(notInAnswer.indexOf(match), 1);
      } else {
        incorrect.push(index);
      }

      return {
        correct: correct,
        incorrect: incorrect,
        notInAnswer: notInAnswer,
      };
    },
    {
      correct: [],
      incorrect: [],
      notInAnswer: correctResponse,
    },
  );
};

export const getCorrectness = (corrected) => {
  const { incorrect, correct, notInAnswer, noCorrectResponse } = corrected;

  if (noCorrectResponse) {
    return 'unknown';
  }

  if (incorrect.length === 0 && correct.length === 0) {
    return 'unanswered';
  }

  if (incorrect.length === 0 && notInAnswer.length === 0) {
    return 'correct';
  }

  if (incorrect.length > 0 || notInAnswer.length > 0) {
    if (correct.length > 0) {
      return 'partial';
    } else {
      return 'incorrect';
    }
  }

  return 'unknown';
};

/**
 * A sample of a normalize function see:
 * https://github.com/pie-framework/pie-elements/issues/21
 */
export function normalize(question) {
  const feedback = merge(defaults.feedback, question.feedback);

  return { ...defaults, ...question, feedback };
}

export function createDefaultModel(model = {}) {
  return new Promise((resolve) => {
    const out = {
      ...model,
      graph: {
        ...defaults.graph,
        ...model.graph,
      },
      colorContrast: 'black_on_white',
    };

    resolve(omitBy(out, (v) => !v));
  });
}

// this function is duplicated in configure; at some point, use the same shared function
const updateTicks = (model) => {
  const { graph: { domain, labelStep, ticks = {} } = {} } = model;
  const { minor, major } = ticks;

  if (domain) {
    domain.min = Number((domain.min || 0).toFixed(2));
    domain.max = Number((domain.max || 0).toFixed(2));
  }

  if (labelStep && typeof labelStep === 'string' && labelStep.match(/^[1-9][0-9]*\/[1-9][0-9]*$/g)) {
    model.graph.fraction = true;
    ticks.tickIntervalType = 'Fraction';

    // update the ticks frequency and label value to match the label step if needed
    const step = math.evaluate(labelStep);

    if (step !== major) {
      ticks.major = step;
      ticks.minor = step / (major / minor);
    }
  }

  return model;
};

export function model(question, session, env) {
  if (!question) {
    return Promise.reject(new Error('question is null'));
  }

  return new Promise(async (resolve, reject) => {
    const normalizedQuestion = await normalize(question);
    const normalizedModel = updateTicks(normalizedQuestion);
    // this function is also called in configure, it is a duplicate to maintain consistency and correctness
    const graph = reloadTicksData(normalizedModel.graph);

    if (graph) {
      const evaluateMode = env.mode === 'evaluate';

      const correctResponse = cloneDeep(normalizedQuestion.correctResponse);
      const corrected = evaluateMode && getCorrected(session ? session.answer || [] : [], correctResponse);
      const correctness = evaluateMode && getCorrectness(corrected);

      const { exhibitOnly } = graph;
      const disabled = env.mode !== 'gather' || exhibitOnly === true;
      let teacherInstructions = null;

      if (env.role === 'instructor' && (env.mode === 'view' || evaluateMode)) {
        teacherInstructions = normalizedQuestion.teacherInstructions;
      }

      const fb = evaluateMode
        ? getFeedbackForCorrectness(correctness, normalizedQuestion.feedback)
        : Promise.resolve(undefined);

      fb.then((feedbackMessage) => {
        const out = {
          prompt: normalizedQuestion.prompt,
          teacherInstructions,
          graph,
          disabled,
          corrected,
          correctResponse:
            evaluateMode && ['unanswered', 'correct'].indexOf(correctness) === -1 && normalizedQuestion.correctResponse,
          feedback: feedbackMessage && {
            type: correctness,
            message: feedbackMessage,
          },
          colorContrast: (env.accessibility && env.accessibility.colorContrast) || 'black_on_white',
          language: normalizedQuestion.language,
          extraCSSRules: normalizedQuestion.extraCSSRules,
        };
        resolve(omitBy(out, (v) => !v));
      });
    } else {
      reject(new Error('graph is undefined'));
    }
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { correctResponse: answer } = question;

      resolve({
        answer,
        id: '1',
      });
    } else {
      resolve(null);
    }
  });
};

// remove all html tags
const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

// remove all html tags except img and iframe
const getContent = (html) => (html || '').replace(/(<(?!img|iframe)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const { graph, correctResponse } = model || {};
  const { maxMaxElements = 20, numberLineDimensions: { min: minWidth = 200, max: maxWidth = 800 } = {} } = config || {};
  const { width, domain, maxNumberOfPoints } = graph || {};
  const { min, max } = domain || {};
  const errors = {};

  ['teacherInstructions', 'prompt'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  if (width < minWidth || width > maxWidth) {
    errors.widthError = `Width should be a value between ${minWidth} and ${maxWidth}.`;
  }

  const MIN_DOMAIN = -100000;
  const MAX_DOMAIN = 100000;

  if (min < MIN_DOMAIN || min > MAX_DOMAIN || max < MIN_DOMAIN || max > MAX_DOMAIN) {
    errors.domainError = `Min and max values must both be in the range [${MIN_DOMAIN}, ${MAX_DOMAIN}].`;
  }

  if (min >= max) {
    errors.maxError = 'Max value must be greater than min value.';
  }

  if (maxNumberOfPoints < 1 || maxNumberOfPoints > maxMaxElements) {
    errors.pointsError = `Max number of elements should be between 1 and ${maxMaxElements}.`;
  }

  if (correctResponse && correctResponse.length === 0) {
    errors.correctResponseError = 'The correct answer should include at least one number line object.';
  }

  return errors;
};
