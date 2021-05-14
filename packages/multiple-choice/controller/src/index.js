/* eslint-disable no-console */
import isEmpty from 'lodash/isEmpty';
import { isResponseCorrect } from './utils';
import defaults from './defaults';
import { lockChoices, partialScoring, getShuffledChoices } from '@pie-lib/controller-utils';

const prepareChoice = (model, env, defaultFeedback) => choice => {
  const { role, mode } = env || {};
  const out = {
    label: choice.label,
    value: choice.value
  };

  if (role === 'instructor' && (mode === 'view' || mode === 'evaluate')) {
    out.rationale = model.rationaleEnabled ? choice.rationale : null;
  } else {
    out.rationale = null;
  }

  if (mode === 'evaluate') {
    out.correct = !!choice.correct;

    if (model.feedbackEnabled) {
      const feedbackType = (choice.feedback && choice.feedback.type) || 'none';

      if (feedbackType === 'default') {
        out.feedback = defaultFeedback[choice.correct ? 'correct' : 'incorrect'];
      } else if (feedbackType === 'custom') {
        out.feedback = choice.feedback.value;
      }
    }
  }

  return out;
};

export function createDefaultModel(model = {}) {
  return new Promise(resolve => resolve({ ...defaults, ...model }));
}

export const normalize = question => ({ ...defaults, ...question });

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export async function model(question, session, env, updateSession) {
  const normalizedQuestion = normalize(question);
  const defaultFeedback = Object.assign(
    { correct: 'Correct', incorrect: 'Incorrect' },
    normalizedQuestion.defaultFeedback
  );

  let choices = normalizedQuestion.choices.map(
    prepareChoice(normalizedQuestion, env, defaultFeedback)
  );

  const lockChoiceOrder = lockChoices(normalizedQuestion, session, env);

  if (!lockChoiceOrder) {
    choices = await getShuffledChoices(
      choices,
      session,
      updateSession,
      'value'
    );
  }

  const out = {
    disabled: env.mode !== 'gather',
    mode: env.mode,
    prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
    choicesLayout: normalizedQuestion.choicesLayout,
    gridColumns: normalizedQuestion.gridColumns,
    choiceMode: normalizedQuestion.choiceMode,
    keyMode: normalizedQuestion.choicePrefix,
    choices,
    responseCorrect:
      env.mode === 'evaluate' ? isResponseCorrect(normalizedQuestion, session) : undefined
  };

  const { role, mode } = env || {};

  if (role === 'instructor' && (mode === 'view' || mode === 'evaluate')) {
    out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
      ? normalizedQuestion.teacherInstructions
      : null;
  } else {
    out.teacherInstructions = null;
  }

  return out;
}


export const getScore = (config, session) => {
  if (!session || isEmpty(session)) {
    return 0;
  }

  const selectedChoices = session.value || [];
  const correctChoices = (config.choices || []).filter(ch => ch.correct);

  let score = selectedChoices.reduce((acc, selectedChoice) =>
    acc + (correctChoices.find(ch => ch.value === selectedChoice) ? 1 : 0), 0);

  if (correctChoices.length < selectedChoices.length) {
    score -= selectedChoices.length - correctChoices.length;

    if (score < 0) {
      score = 0;
    }
  }

  const str = correctChoices.length ? score / correctChoices.length : 0;

  return parseFloat(str.toFixed(2));
};

/**
 *
 * The score is partial by default for checkbox mode, allOrNothing for radio mode.
 * To disable partial scoring for checkbox mode you either set model.partialScoring = false or env.partialScoring = false. the value in `env` will
 * override the value in `model`.
 * @param {Object} model - the main model
 * @param {*} session
 * @param {Object} env
 */
export function outcome(model, session, env) {
  return new Promise(resolve => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    } else {
      const partialScoringEnabled =
        partialScoring.enabled(model, env) && model.choiceMode !== 'radio';
      const score = getScore(model, session);

      resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0, empty: false });
    }
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question || { choices: [] };

      resolve({
        id: '1',
        value: choices.filter(c => c.correct).map(c => c.value)
      });
    } else {
      resolve(null);
    }
  });
};
