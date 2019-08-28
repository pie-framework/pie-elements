import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';

import defaults from './defaults';

const log = debug('@pie-element:graph-lines:controller');

const getResponseCorrectness = (
  model,
  answers
) => {
  const partialScoring = true /*model.partialScoring*/;
  const prompts = model.prompts;

  if (!answers || Object.keys(answers).length === 0) {
    return 'unanswered';
  }

  const totalCorrectAnswers = getTotalCorrect(model);
  const correctAnswers = getCorrectSelected(prompts, answers);

  if (totalCorrectAnswers === correctAnswers) {
    return  'correct';
  } else if (correctAnswers === 0) {
    return 'incorrect';
  } else if (partialScoring) {
    return 'partial';
  }

  return 'incorrect';
};

const getCorrectness = (question, env, answers) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      answers
    );
  }
};

const getCorrectSelected = (prompts = [], answers) => {
  let correctAnswers = 0;

  prompts.forEach(p => {
    if (p.relatedAnswer === answers[p.id]) {
      correctAnswers += 1;
    }
  });

  return correctAnswers;
};

const getTotalCorrect = (question) => {
  return (question && question.prompts) ? question.prompts.length : 0;
};

const getPartialScore = (question, answers) => {
  const count = getCorrectSelected(question && question.prompts, answers);
  const totalCorrect = getTotalCorrect(question);

  return parseFloat((count / totalCorrect).toFixed(2));
};

const getOutComeScore = (question, env, answers) => {
  const correctness = getCorrectness(
    question,
    env,
    answers
  );

  return (
    correctness === 'correct'
      ? 1
      : correctness === 'partial' &&
      true
      ? getPartialScore(question, answers)
      : 0
  );
};

export const outcome = (question, session, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      if (!session || isEmpty(session)) {
        resolve({ score: 0, empty: true });
      } else {
        const out = {
          score: getOutComeScore(question, env, session.value)
        };

        resolve(out);
      }
    }
  });
};

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      ...defaults,
      ...model
    });
  });
}

export function model(question, session, env) {
  return new Promise(resolve => {
    const correctness = getCorrectness(question, env, session && session.value);
    const correctResponse = {};
    const score =  `${getOutComeScore(question, env, session && session.value) * 100}%`;
    const correctInfo = {
      score,
      correctness
    };

    if (question && question.prompts) {
      question.prompts.forEach(prompt => {
        correctResponse[prompt.id] = prompt.relatedAnswer;
      });
    }

    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctInfo.correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        config: {
          ...question,
          shuffled: !question.lockChoiceOrder
        },
        correctness: correctInfo,
        feedback,
        mode: env.mode
      };

      if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
        base.rationale = question.rationale;
      } else {
        base.rationale = null;
      }

      const out = Object.assign(base, {
        correctResponse
      });
      log('out: ', out);
      resolve(out);
    });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { prompts, answers } = question;
      const value = {};

      prompts.forEach(p => {
        if (answers.filter(a => a.id === p.relatedAnswer).length) {
          value[p.id] = p.relatedAnswer;
        }
      });

      resolve({
        value,
        id: '1'
      });
    }
  });
};

