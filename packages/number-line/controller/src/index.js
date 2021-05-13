import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';
import merge from 'lodash/merge';
import omitBy from 'lodash/omitBy';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { partialScoring } from '@pie-lib/controller-utils';

import defaults from './defaults';

const score = number => {
  return {
    score: {
      scaled: number
    }
  };
};

const getPartialScore = (corrected, ps) => {
  const { correct } = corrected;
  const rule = ps.find(r => r.numberOfCorrect === correct.length);

  if (rule) {
    return 1.0 * (rule.scorePercentage / 100);
  } else {
    return 0;
  }
};

const accumulateAnswer = correctResponse => (total, answer) => {
  const isCorrectResponse = correctResponse.some(cr => matches(cr)(answer));
  return total + (isCorrectResponse ? 1 : 0);
};

/**
 */
export function outcome(model, session, env) {
  return new Promise(resolve => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    } else {
      const partialScoringEnabled = partialScoring.enabled(model, env);
      const numCorrect = (session.answer || []).reduce(
        accumulateAnswer(model.correctResponse),
        0
      );

      let numIncorrect = 0;
      if((session.answer || []).length > model.correctResponse.length) {
         numIncorrect = (session.answer || []).length - model.correctResponse.length;
      }

      const total = model.correctResponse.length;
      let score = numCorrect < 0 ? 0 : (numCorrect - numIncorrect) / total;

      if(score < 0) {
        score = 0;
      }

      resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0 });
    }
  });
}

export function getScore(question, session) {
  return new Promise(resolve => {
    if (!session || isEmpty(session)) {
      resolve({ score: { scaled: 0 } })
    } else {
      session.answer = session.answer || [];

      const corrected = getCorrected(
        session.answer,
        cloneDeep(question.correctResponse)
      );

      const correctness = getCorrectness(corrected);

      if (correctness === 'correct') {
        resolve(score(1.0));
      } else if (correctness === 'incorrect') {
        resolve(score(0.0));
      } else if (correctness === 'partial') {
        const { allowPartialScoring, partialScoring } = question;
        const ps = (partialScoring || []).filter(o => !isEmpty(o));
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

const matches = a => v => {
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
      noCorrectResponse: true
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
        notInAnswer: notInAnswer
      };
    },
    {
      correct: [],
      incorrect: [],
      notInAnswer: correctResponse
    }
  );
};

export const getCorrectness = corrected => {
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

const feedbackDefaults = {
  correct: {
    type: 'default',
    default: 'Correct'
  },
  incorrect: {
    type: 'default',
    default: 'Incorrect'
  },
  partial: {
    type: 'default',
    default: 'Nearly'
  }
};

/**
 * A sample of a normalize function see:
 * https://github.com/pie-framework/pie-elements/issues/21
 */
export function normalize(question) {
  return new Promise(resolve => {
    const feedback = merge(feedbackDefaults, question.feedback);
    if (isEqual(feedback, question.feedback)) {
      return resolve(undefined);
    } else {
      question.feedback = feedback;
      resolve(question);
    }
  });
}

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    const out = {
      graph: {
        ...defaults,
        ...model
      },
      colorContrast: 'black_on_white'
    };

    resolve(omitBy(out, v => !v));
  });
}

export function model(question, session, env) {
  if (!question) {
    return Promise.reject(new Error('question is null'));
  }

  return new Promise((resolve, reject) => {
    const { graph } = question;
    if (graph) {
      const evaluateMode = env.mode === 'evaluate';

      const correctResponse = cloneDeep(question.correctResponse);
      const corrected =
        evaluateMode &&
        getCorrected(session ? session.answer || [] : [], correctResponse);
      const correctness = evaluateMode && getCorrectness(corrected);

      const { exhibitOnly } = graph;

      const disabled = env.mode !== 'gather' || exhibitOnly === true;

      const fb = evaluateMode
        ? getFeedbackForCorrectness(correctness, question.feedback)
        : Promise.resolve(undefined);

      fb.then(feedbackMessage => {
        const out = {
          prompt: question.prompt,
          graph,
          disabled,
          corrected,
          correctResponse:
            evaluateMode &&
            ['unanswered', 'correct'].indexOf(correctness) === -1 &&
            question.correctResponse,
          feedback: feedbackMessage && {
            type: correctness,
            message: feedbackMessage
          },
          colorContrast:
            (env.accessibility && env.accessibility.colorContrast) ||
            'black_on_white'
        };

        resolve(omitBy(out, v => !v));
      });
    } else {
      reject(new Error('graph is undefined'));
    }
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { correctResponse: answer } = question;

      resolve({
        answer,
        id: '1'
      });
    } else {
      resolve(null);
    }
  });
};
