import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';

import defaults from './defaults';

const log = debug('@pie-element:graph-lines:controller');

const getResponseCorrectness = (
  model,
  answers
) => {
  const allowPartialScores = model.allowPartialScoring;
  const partialScoring = model.partialScoring;
  const rows = model.rows;

  if (!answers || Object.keys(answers).length === 0) {
    return 'unanswered';
  }

  const totalCorrectAnswers = getTotalCorrect(model);
  const correctAnswers = getCorrectSelected(rows, answers);

  if (totalCorrectAnswers === correctAnswers) {
    return  'correct';
  } else if (correctAnswers === 0) {
    return 'incorrect';
  } else if (allowPartialScores && partialScoring) {
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

const getCorrectSelected = (rows, answers) => {
  let correctAnswers = 0;

  rows.forEach(row => {
    const answer = answers[row.id];

    if (answer) {
      row.values.forEach((v, i) => {
        if (answer[i] === v) {
          correctAnswers += 1;
        }
      });
    }
  });

  return correctAnswers;
};

const getTotalCorrect = (question) => {
  return (question.rows.length || 0) * (question.layout - 1);
};

const getPartialScore = (question, answers) => {
  const count = getCorrectSelected(question.rows, answers);
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
      question.partialScoring
      ? getPartialScore(question, answers)
      : 0
  );
};

export const outcome = (question, session, env) => {
  return new Promise((resolve, reject) => {
    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      const out = {
        score: getOutComeScore(question, env, session.answers)
      };

      resolve(out);
    }
  });
};

export function createConfigModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      ...defaults,
      ...model
    });
  });
}

export function model(question, session, env) {
  return new Promise(resolve => {
    const correctness = getCorrectness(question, env, session.answers);
    const correctResponse = {};
    const score =  `${getOutComeScore(question, env, session.answers) * 100}%`;
    const correctInfo = {
      score,
      correctness
    };

    question.rows.forEach(row => {
      correctResponse[row.id] = row.values;
    });

    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctInfo.correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        config: question,
        correctness: correctInfo,
        feedback,
        disabled: env.mode !== 'gather',
        view: env.mode === 'view'
      };

      const out = Object.assign(base, {
        correctResponse
      });
      log('out: ', out);
      resolve(out);
    });
  });
}
