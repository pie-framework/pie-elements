import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import omitBy from 'lodash/omitBy';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';

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

export function outcome(question, session) {
  session.answer = session.answer || [];

  return new Promise(resolve => {
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
  });
}

const getCorrected = (answer, correctResponse) => {
  const matches = a => {
    return v => {
      return isEqual(a, v);
    };
  };

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

const getCorrectness = corrected => {
  const { incorrect, correct, notInAnswer } = corrected;

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

export function createConfigModel(model = {}) {
  return new Promise(resolve => {
    const out = {
      config: {
        ...defaults,
        ...model
      },
      colorContrast: 'black_on_white',
    };

    resolve(omitBy(out, v => !v));
  });
}

export function model(question, session, env) {
  if (!question) {
    return Promise.reject(new Error('question is null'));
  }

  return new Promise((resolve, reject) => {
    const { config } = question;
    if (config) {
      const evaluateMode = env.mode === 'evaluate';

      const correctResponse = cloneDeep(question.correctResponse);
      const corrected =
        evaluateMode &&
        getCorrected(session ? session.answer || [] : [], correctResponse);
      const correctness = evaluateMode && getCorrectness(corrected);

      const { exhibitOnly } = config;

      const disabled = env.mode !== 'gather' || exhibitOnly === true;

      const fb = evaluateMode
        ? getFeedbackForCorrectness(correctness, question.feedback)
        : Promise.resolve(undefined);

      fb.then(feedbackMessage => {
        const out = {
          config,
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
      reject(new Error('config is undefined'));
    }
  });
}
