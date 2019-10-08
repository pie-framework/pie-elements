import _ from 'lodash';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { getShuffledChoices } from '@pie-lib/controller-utils';

const lg = n => console[n].bind(console, '[match]');
const log = lg('log');

import defaults from './defaults';

const getResponseCorrectness = (model, answers) => {
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
    return 'correct';
  } else if (correctAnswers === 0) {
    return 'incorrect';
  } else if (partialScoring) {
    return 'partial';
  }

  return 'incorrect';
};

const getCorrectness = (question, env, answers = {}) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(question, answers);
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

const getTotalCorrect = question => {
  const checkboxMode = question.choiceMode === 'checkbox';
  const matchingTable = checkboxMode ? question.layout - 1 : 1;
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

const getOutComeScore = (question, env, answers = {}) => {
  const correctness = getCorrectness(question, env, answers);

  return correctness === 'correct'
    ? 1
    : correctness === 'partial' && question.partialScoring
      ? getPartialScore(question, answers)
      : 0;
};

export const outcome = (question, session, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      if (!session || _.isEmpty(session)) {
        resolve({ score: 0, empty: true });
      }

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

export const normalize = question => ({
  feedbackEnabled: true,
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export function model(question, session, env, updateSession) {
  return new Promise(async resolve => {
    const normalizedQuestion = normalize(question);
    let correctness, score;

    if ((!session || _.isEmpty(session)) && env.mode === 'evaluate') {
      correctness = 'unanswered';
      score = '0%';
    } else {
      correctness = getCorrectness(normalizedQuestion, env, session && session.answers);
      score = `${getOutComeScore(normalizedQuestion, env, session && session.answers) *
      100}%`;
    }

    const correctResponse = {};
    const correctInfo = {
      score,
      correctness
    };

    if (!normalizedQuestion.lockChoiceOrder) {
      normalizedQuestion.rows = await getShuffledChoices(
        normalizedQuestion.rows,
        session,
        updateSession,
        'id'
      );
    }

    normalizedQuestion.rows.forEach(row => {
      correctResponse[row.id] = row.values;
    });

    const fb =
      env.mode === 'evaluate' && normalizedQuestion.feedbackEnabled
        ? getFeedbackForCorrectness(correctInfo.correctness, normalizedQuestion.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        allowFeedback: normalizedQuestion.feedbackEnabled,
        prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
        config: {
          ...normalizedQuestion,
          shuffled: !normalizedQuestion.lockChoiceOrder
        },
        correctness: correctInfo,
        feedback,
        disabled: env.mode !== 'gather',
        view: env.mode === 'view'
      };

      if (
        env.role === 'instructor' &&
        (env.mode === 'view' || env.mode === 'evaluate')
      ) {
        base.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
          ? normalizedQuestion.teacherInstructions
          : null;
        base.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
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

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { rows } = question;
      const answers = {};

      rows.forEach(r => {
        answers[r.id] = r.values;
      });

      resolve({
        answers,
        id: '1'
      });
    }
  });
};
