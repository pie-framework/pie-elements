/* eslint-disable no-console */
import isEmpty from 'lodash/isEmpty';
import { isResponseCorrect, parseHTML } from './utils';
import defaults from './defaults';
import { lockChoices, partialScoring, getShuffledChoices } from '@pie-lib/pie-toolbox/controller-utils';

const prepareChoice = (model, env, defaultFeedback) => (choice) => {
  const { role, mode } = env || {};
  const out = {
    label: choice.label,
    value: choice.value,
  };

  if (model.accessibilityLabelsEnabled) {
    out.accessibility = parseHTML(choice.accessibility).textContent || choice.value;
  }

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
  return new Promise((resolve) => resolve({ ...defaults, ...model }));
}

export const normalize = (question) => {
  const { verticalMode, choicesLayout, ...questionProps } = question || {};

  return {
    ...defaults,
    ...questionProps,
    // This is used for offering support for old models which have the property verticalMode
    // Same thing is set in authoring : packages/multiple-choice/configure/src/index.jsx - createDefaultModel
    choicesLayout: choicesLayout || (verticalMode === false && 'horizontal') || defaults.choicesLayout,
  };
};

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
    normalizedQuestion.defaultFeedback,
  );

  let choices = (normalizedQuestion.choices || []).map(prepareChoice(normalizedQuestion, env, defaultFeedback));

  const lockChoiceOrder = lockChoices(normalizedQuestion, session, env);

  if (!lockChoiceOrder) {
    choices = await getShuffledChoices(choices, session, updateSession, 'value');
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
    responseCorrect: env.mode === 'evaluate' ? isResponseCorrect(normalizedQuestion, session) : undefined,
    language: normalizedQuestion.language,
    extraCSSRules: normalizedQuestion.extraCSSRules,
    fontSizeFactor: normalizedQuestion.fontSizeFactor,
    selectionButtonPosition: normalizedQuestion.selectionButtonPosition,
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
  const correctChoices = (config.choices || []).filter((ch) => ch.correct);

  let score = selectedChoices.reduce(
    (acc, selectedChoice) => acc + (correctChoices.find((ch) => ch.value === selectedChoice) ? 1 : 0),
    0,
  );

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
  return new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    } else {
      const partialScoringEnabled = partialScoring.enabled(model, env) && model.choiceMode !== 'radio';
      const score = getScore(model, session);

      resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0, empty: false });
    }
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question || { choices: [] };

      resolve({
        id: '1',
        value: choices.filter((c) => c.correct).map((c) => c.value),
      });
    } else {
      resolve(null);
    }
  });
};

// remove all html tags
const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

// remove all html tags except img and iframe
const getContent = (html) => (html || '').replace(/(<(?!img|iframe)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const { choices } = model;
  const { minAnswerChoices = 2, maxAnswerChoices } = config;
  const reversedChoices = [...(choices || [])].reverse();
  const choicesErrors = {};
  const rationaleErrors = {};
  const errors = {};

  ['teacherInstructions', 'prompt'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  let hasCorrectResponse = false;

  reversedChoices.forEach((choice, index) => {
    const { correct, value, label, rationale } = choice;

    if (correct) {
      hasCorrectResponse = true;
    }

    if (!getContent(label)) {
      choicesErrors[value] = 'Content should not be empty.';
    } else {
      const identicalAnswer = reversedChoices.slice(index + 1).some((c) => c.label === label);

      if (identicalAnswer) {
        choicesErrors[value] = 'Content should be unique.';
      }
    }

    if (config.rationale?.required && !getContent(rationale)) {
      rationaleErrors[value] = 'This field is required.';
    }
  });

  const nbOfChoices = (choices || []).length;

  if (nbOfChoices < minAnswerChoices) {
    errors.answerChoices = `There should be at least ${minAnswerChoices} choices defined.`;
  } else if (nbOfChoices > maxAnswerChoices) {
    errors.answerChoices = `No more than ${maxAnswerChoices} choices should be defined.`;
  }

  if (!hasCorrectResponse) {
    errors.correctResponse = 'No correct response defined.';
  }

  if (!isEmpty(choicesErrors)) {
    errors.choices = choicesErrors;
  }

  if (!isEmpty(rationaleErrors)) {
    errors.rationale = rationaleErrors;
  }

  return errors;
};
