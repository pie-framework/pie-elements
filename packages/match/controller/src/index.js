import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { lockChoices, getShuffledChoices, partialScoring } from '@pie-lib/controller-utils';
import debug from 'debug';

const log = debug('@pie-element:match:controller');

import defaults from './defaults';

const getResponseCorrectness = (model, answers, env = {}) => {
  const isPartialScoring = partialScoring.enabled(model, env);
  const rows = model.rows;
  const checkboxMode = model.choiceMode === 'checkbox';

  if (!answers || Object.keys(answers).length === 0) {
    return 'unanswered';
  }

  const totalCorrectAnswers  = checkboxMode ? getTotalCorrectAnswers(model) : getTotalCorrect(model);
  const correctAnswers = checkboxMode
    ? getCheckboxes(rows, answers).correctAnswers
    : getCorrectRadios(rows, answers);

  if (totalCorrectAnswers === correctAnswers) {
    return 'correct';
  } else if (correctAnswers === 0) {
    return 'incorrect';
  } else if (isPartialScoring) {
    return 'partial';
  }

  return 'incorrect';
};

const getCorrectness = (question, env, answers = {}) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(question, answers, env);
  }
};

const getCheckboxes = (rows, answers) => {
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  rows.forEach(row => {
    const answer = answers[row.id];

    if (answer) {
      row.values.forEach((v, i) => {
        if (answer[i] && answer[i] === v ) {
          correctAnswers += 1;
        } else if (answer[i] && answer[i] !== v ){
          incorrectAnswers += 1;
        }
      });
    }
  });

  return { correctAnswers, incorrectAnswers };
};

const getCorrectRadios = (rows, answers) => {
  let correctAnswers = 0;

  rows.forEach(row => {
    if (isEqual(row.values, answers[row.id])) {
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

const getTotalCorrectAnswers = question => {
  let noOfTotalCorrectAnswers = 0;

  question.rows.forEach(row => {
    row.values.forEach(value => {
      if(value) {
        noOfTotalCorrectAnswers += 1;
      }
    });
  });

  return noOfTotalCorrectAnswers;
};

const getPartialScore = (question, answers) => {
  const checkboxMode = question.choiceMode === 'checkbox';

  if(checkboxMode) {
    const { correctAnswers, incorrectAnswers } = getCheckboxes(question.rows, answers);
    const totalCorrect = getTotalCorrectAnswers(question);

    const total = totalCorrect === 0 ? 1 : totalCorrect;

    if (correctAnswers + incorrectAnswers > totalCorrect) {
      const extraAnswers = (correctAnswers + incorrectAnswers) - totalCorrect;
      const score = parseFloat(((correctAnswers - extraAnswers) / total).toFixed(2));

      return score < 0 ? 0 : score;
    } else {
      return parseFloat((correctAnswers / total).toFixed(2));
    }
  } else {
    const correctAnswers = getCorrectRadios(question.rows, answers);
    const totalCorrect = getTotalCorrect(question) === 0 ? 1 : getTotalCorrect(question);

    return parseFloat((correctAnswers / totalCorrect).toFixed(2));
  }
};

const getOutComeScore = (question, env, answers = {}) => {
  const correctness = getCorrectness(question, env, answers);
  const isPartialScoring = partialScoring.enabled(question, env);

  return correctness === 'correct'
    ? 1
    : correctness === 'partial' && isPartialScoring
      ? getPartialScore(question, answers)
      : 0;
};

export const outcome = (question, session, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      if (!session || isEmpty(session)) {
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
    const normalizedQuestion = cloneDeep(normalize(question));
    let correctness, score;

    if ((!session || isEmpty(session)) && env.mode === 'evaluate') {
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

    const lockChoiceOrder = lockChoices(normalizedQuestion, session, env);

    if (!lockChoiceOrder) {
      normalizedQuestion.rows = await getShuffledChoices(
        normalizedQuestion.rows,
        session,
        updateSession,
        'id'
      );
    }

    normalizedQuestion.rows.forEach(row => {
      correctResponse[row.id] = row.values;

      if (env.mode !== 'evaluate') {
        delete row.values;
      }
    });

    const fb =
      env.mode === 'evaluate' && normalizedQuestion.feedbackEnabled
        ? getFeedbackForCorrectness(correctInfo.correctness, normalizedQuestion.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const out = {
        allowFeedback: normalizedQuestion.feedbackEnabled,
        prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
        config: {
          ...normalizedQuestion,
          shuffled: !normalizedQuestion.lockChoiceOrder
        },
        feedback,
        disabled: env.mode !== 'gather',
        view: env.mode === 'view'
      };

      if (
        env.role === 'instructor' &&
        (env.mode === 'view' || env.mode === 'evaluate')
      ) {
        out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
          ? normalizedQuestion.teacherInstructions
          : null;
        out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      } else {
        out.rationale = null;
        out.teacherInstructions = null;
        out.config.rationale = null;
        out.config.teacherInstructions = null;
      }

      if (env.mode === 'evaluate') {
        Object.assign(out, {
          correctResponse,
          correctness: correctInfo,
        });
      }

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
    } else {
      resolve(null);
    }
  });
};
