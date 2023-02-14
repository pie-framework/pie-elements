import defaults from './defaults';
import { lockChoices, getShuffledChoices, partialScoring } from '@pie-lib/controller-utils';
import { isResponseCorrect } from './utils';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const prepareChoice = (model, env, defaultFeedback) => (choice) => {
  const out = {
    label: choice.label,
    value: choice.value,
  };

  if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
    out.rationale = model.rationaleEnabled ? choice.rationale : null;
  } else {
    out.rationale = null;
  }

  if (env.mode === 'evaluate') {
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

const parsePart = (part, key, session, env) => {
  const defaultFeedback = Object.assign({ correct: 'Correct', incorrect: 'Incorrect' }, part.defaultFeedback);

  let choices = part.choices ? part.choices.map(prepareChoice(part, env, defaultFeedback)) : [];

  return {
    ...part,
    choices,
    disabled: env.mode !== 'gather',
    complete: {
      min: part.choices.filter((c) => c.correct).length,
    },
    responseCorrect: env.mode === 'evaluate' ? isResponseCorrect(part, key, session) : undefined,
  };
};

export const normalize = ({ partA = {}, partB = {}, ...question }) => ({
  partLabels: true,
  partLabelType: 'Letters',
  ...question,
  partA: {
    ...defaults.partA,
    rationaleEnabled: true,
    feedbackEnabled: false,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    gridColumns: '2',
    ...partA,
    choicesLayout: partA.choicesLayout || (partA.verticalMode === false && 'horizontal') || 'vertical',
  },
  partB: {
    ...defaults.partB,
    rationaleEnabled: true,
    promptEnabled: true,
    feedbackEnabled: false,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    gridColumns: '2',
    ...partB,
    choicesLayout: partB.choicesLayout || (partB.verticalMode === false && 'horizontal') || 'vertical',
  },
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
  const partA = parsePart(normalizedQuestion.partA, 'partA', session, env);
  const partB = parsePart(normalizedQuestion.partB, 'partB', session, env);

  const shuffledValues = {};

  const us = (part) => (id, element, update) =>
    new Promise((resolve) => {
      shuffledValues[part] = update.shuffledValues;
      resolve();
    });

  const partASession = get(session, 'value.partA');
  const partALockChoiceOrder = lockChoices(normalizedQuestion.partA, partASession, env);

  const { choices: partAChoices } = partA || {};
  const { choices: partBChoices } = partB || {};

  if (!partALockChoiceOrder && partAChoices && partAChoices.length) {
    partA.choices = await getShuffledChoices(
      partAChoices,
      { shuffledValues: (session.shuffledValues || {}).partA },
      us('partA'),
      'value',
    );
  }

  const partBSession = get(session, 'value.partB');
  const partBLockChoiceOrder = lockChoices(normalizedQuestion.partB, partBSession, env);

  if (!partBLockChoiceOrder && partBChoices && partBChoices.length) {
    partB.choices = await getShuffledChoices(
      partBChoices,
      { shuffledValues: (session.shuffledValues || {}).partB },
      us('partB'),
      'value',
    );
  }

  if (!isEmpty(shuffledValues)) {
    if (updateSession && typeof updateSession === 'function') {
      updateSession(session.id, session.element, {
        shuffledValues,
      }).catch((e) => {
        console.error('update session failed', e);
      });
    }
  }

  if (normalizedQuestion.partLabels) {
    partA.partLabel = normalizedQuestion.partLabelType === 'Letters' ? 'Part A' : 'Part 1';
    partB.partLabel = normalizedQuestion.partLabelType === 'Letters' ? 'Part B' : 'Part 2';
  } else {
    partA.partLabel = undefined;
    partB.partLabel = undefined;
  }

  if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
    partA.teacherInstructions = normalizedQuestion.partA.teacherInstructionsEnabled
      ? normalizedQuestion.partA.teacherInstructions
      : null;
    partB.teacherInstructions = normalizedQuestion.partB.teacherInstructionsEnabled
      ? normalizedQuestion.partB.teacherInstructions
      : null;
  } else {
    partA.teacherInstructions = null;
    partB.teacherInstructions = null;
  }

  partA.prompt = normalizedQuestion.partA.promptEnabled ? normalizedQuestion.partA.prompt : null;
  partB.prompt = normalizedQuestion.partB.promptEnabled ? normalizedQuestion.partB.prompt : null;

  return new Promise((resolve) => {
    resolve({
      disabled: env.mode !== 'gather',
      mode: env.mode,
      partA,
      partB,
    });
  });
}

export const createDefaultModel = (model = {}) =>
  new Promise((resolve) => {
    resolve({
      ...defaults,
      ...model,
    });
  });

const isCorrect = (c) => c.correct === true;

const getScore = (config, sessionPart, key, partialScoringEnabled) => {
  const { choices = [] } = (config && config[key]) || {};
  const maxScore = choices.length;
  const { value: sessionPartValue } = sessionPart || {};

  const chosen = (c) => !!(sessionPartValue || []).find((v) => v === c.value);
  const correctAndNotChosen = (c) => isCorrect(c) && !chosen(c);
  const incorrectAndChosen = (c) => !isCorrect(c) && chosen(c);
  const correctChoices = choices.reduce((total, choice) => {
    if (correctAndNotChosen(choice) || incorrectAndChosen(choice)) {
      return total - 1;
    } else {
      return total;
    }
  }, choices.length);

  // determine score for a part
  if (!partialScoringEnabled && correctChoices < maxScore) {
    return 0;
  }

  return parseFloat(maxScore ? (correctChoices / maxScore).toFixed(2) : 0);
};

export function outcome(config, session, env) {
  return new Promise((resolve) => {
    const { value } = session || {};

    if (!session || !value) {
      resolve({ score: 0, scoreA: 0, scoreB: 0, empty: true });
    }

    if (value) {
      const { partA, partB } = value || {};

      const partialScoringEnabled = partialScoring.enabled(config, env);

      const scoreA = getScore(config, partA, 'partA', partialScoringEnabled);
      const scoreB = getScore(config, partB, 'partB', partialScoringEnabled);

      if (!partialScoringEnabled) {
        // The EBSR item is worth 1 point
        // That point is awarded if and only if both parts are fully correct, otherwise no points are awarded
        resolve({ score: scoreA === 1 && scoreB === 1 ? 1 : 0, scoreA, scoreB, max: 1 });
      } else {
        // The EBSR item is worth 2 points
        if (scoreA === 1) {
          if (scoreB === 1) {
            // If Part A and Part B are both correct, 2 points are awarded
            resolve({ score: 2, scoreA, scoreB, max: 2 });
          } else {
            // If Part A is correct and part B is incorrect, 1 point is awarded
            resolve({ score: 1, scoreA, scoreB, max: 2 });
          }
        } else {
          // For all other combinations, no points are awarded
          resolve({ score: 0, scoreA, scoreB, max: 2 });
        }
      }
    }
  });
}

const returnPartCorrect = (choices) => {
  let answers = [];

  choices.forEach((i) => {
    const { correct, value } = i;
    if (correct) {
      answers.push(value);
    }
  });
  return answers;
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { partA, partB } = question;

      const partACorrect = returnPartCorrect(partA.choices);
      const partBCorrect = returnPartCorrect(partB.choices);

      resolve({
        value: {
          partA: {
            id: 'partA',
            value: partACorrect,
          },
          partB: {
            id: 'partB',
            value: partBCorrect,
          },
        },
        id: '1',
      });
    } else {
      resolve(null);
    }
  });
};

const validatePart = (model = {}, config = {}) => {
  const { choices } = model;
  const { minAnswerChoices = 2, maxAnswerChoices } = config;
  const reversedChoices = [...(choices || [])].reverse();
  const choicesErrors = {};
  let hasCorrectResponse = false;

  reversedChoices.forEach((choice, index) => {
    const { correct, value, label } = choice;

    if (correct) {
      hasCorrectResponse = true;
    }

    if (label === '' || label === '<div></div>') {
      choicesErrors[value] = 'Content should not be empty.';
    } else {
      const identicalAnswer = reversedChoices.slice(index + 1).some((c) => c.label === label);

      if (identicalAnswer) {
        choicesErrors[value] = 'Content should be unique.';
      }
    }
  });

  const errors = {};
  const nbOfChoices = (choices || []).length;

  if (nbOfChoices < minAnswerChoices) {
    errors.answerChoicesError = `There should be at least ${minAnswerChoices} choices defined.`;
  } else if (nbOfChoices > maxAnswerChoices) {
    errors.answerChoicesError = `No more than ${maxAnswerChoices} choices should be defined.`;
  }

  if (!hasCorrectResponse) {
    errors.correctResponseError = 'No correct response defined.';
  }

  if (!isEmpty(choicesErrors)) {
    errors.choicesErrors = choicesErrors;
  }

  return errors;
};

export const validate = (model = {}, config = {}) => {
  const { partA, partB } = model || {};
  const { partA: partAConfig, partB: partBConfig } = config || {};

  const partAErrors = validatePart(partA, partAConfig);
  const partBErrors = validatePart(partB, partBConfig);

  return { partA: partAErrors, partB: partBErrors };
};
