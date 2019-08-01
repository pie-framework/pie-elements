import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import _ from 'lodash';

import defaults from './defaults';

const log = debug('@pie-element:graph-lines:controller');

const getResponseCorrectness = (
  model,
  answers
) => {
  const partialScoring = model.partialScoring;
  const rows = model.rows;
  const checkboxMode = model.choiceMode === 'checkbox';

  if (!answers || Object.keys(answers).length === 0) {
    return 'unanswered';
  }

  const totalCorrectAnswers = getTotalCorrect(model);
  const correctAnswers = checkboxMode
    ? getCorrectCheckboxes(rows, answers)
    : getCorrectRadios(rows, answers);

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

const getCorrectCheckboxes = (rows, answers) => {
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

const getCorrectRadios = (rows, answers) => {
  let correctAnswers = 0;

  rows.forEach(row => {
    if (_.isEqual(row.values, answers[row.id])) {
      correctAnswers += 1;
    }
  });

  return correctAnswers;
};

const getTotalCorrect = (question) => {
  const checkboxMode = question.choiceMode === 'checkbox';
  const matchingTable = checkboxMode ? (question.layout - 1) : 1;
  return (question.rows.length || 0) * matchingTable;
};

const getPartialScore = (question, answers) => {
  const checkboxMode = question.choiceMode === 'checkbox';
  const count = checkboxMode
    ? getCorrectCheckboxes(question.rows, answers)
    : getCorrectRadios(question.rows, answers);
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
  return new Promise((resolve) => {
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
      env.mode === 'evaluate' && question.allowFeedback
        ? getFeedbackForCorrectness(correctInfo.correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        allowFeedback: question.allowFeedback,
        prompt: question.prompt,
        config: {
          ...question,
          shuffled: !question.lockChoiceOrder
        },
        correctness: correctInfo,
        feedback,
        disabled: env.mode !== 'gather',
        view: env.mode === 'view',
      };

      if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
        base.teacherInstructions = question.teacherInstructions;
        base.rationale = question.rationale;
      } else {
        base.rationale = null;
        base.teacherInstructions = null;
      }

      const out = Object.assign(base, {
        correctResponse
      });
      log('out: ', out);
      resolve(out);
    });
  });
}
