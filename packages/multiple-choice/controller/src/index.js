/* eslint-disable no-console */
import isEmpty from 'lodash/isEmpty';
import { isResponseCorrect } from './utils';
import defaults from './defaults';
import { partialScoring, getShuffledChoices } from '@pie-lib/controller-utils';

const prepareChoice = (model, env, defaultFeedback) => choice => {
  const out = {
    label: choice.label,
    value: choice.value
  };

  if (
    env.role === 'instructor' &&
    (env.mode === 'view' || env.mode === 'evaluate')
  ) {
    out.rationale = model.rationaleEnabled ? choice.rationale : null;
  } else {
    out.rationale = null;
  }

  if (env.mode === 'evaluate') {
    out.correct = !!choice.correct;

    const feedbackType = (choice.feedback && choice.feedback.type) || 'none';

    if (feedbackType === 'default') {
      out.feedback = defaultFeedback[choice.correct ? 'correct' : 'incorrect'];
    } else if (feedbackType === 'custom') {
      out.feedback = choice.feedback.value;
    }
  }

  return out;
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
  ...defaults,
  ...question,
});

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

  if (!normalizedQuestion.lockChoiceOrder) {
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
    choiceMode: normalizedQuestion.choiceMode,
    keyMode: normalizedQuestion.choicePrefix,
    shuffle: !normalizedQuestion.lockChoiceOrder,
    choices,

    //TODO: ok to return this in gather mode? gives a clue to how many answers are needed?
    complete: {
      min: normalizedQuestion.choices ? normalizedQuestion.choices.filter(c => c.correct).length : 0
    },
    responseCorrect:
      env.mode === 'evaluate' ? isResponseCorrect(normalizedQuestion, session) : undefined
  };

  if (
    env.role === 'instructor' &&
    (env.mode === 'view' || env.mode === 'evaluate')
  ) {
    out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
      ? normalizedQuestion.teacherInstructions
      : null;
  } else {
    out.teacherInstructions = null;
  }

  return out;
}

const isCorrect = c => c.correct === true;

export const getScore = (config, session) => {
  if (!session || isEmpty(session)) {
    return 0;
  }

  const maxScore = config.choices.length;
  const chosen = c => !!(session.value || []).find(v => v === c.value);
  const correctAndNotChosen = c => isCorrect(c) && !chosen(c);
  const incorrectAndChosen = c => !isCorrect(c) && chosen(c);
  const correctCount = config.choices.reduce((total, choice) => {
    if (correctAndNotChosen(choice) || incorrectAndChosen(choice)) {
      return total - 1;
    } else {
      return total;
    }
  }, config.choices.length);

  const str = maxScore ? (correctCount / maxScore).toFixed(2) : 0;
  return parseFloat(str);
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
      resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0 });
    }
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question;
      const value = [];

      choices.forEach(c => {
        if (c.correct) {
          value.push(c.value);
        }
      });

      resolve({
        id: '1',
        value
      });
    } else {
      resolve(null);
    }
  });
};
