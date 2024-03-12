import isEmpty from 'lodash/isEmpty';
import { buildState, score } from '@pie-lib/pie-toolbox/categorize';
import { getFeedbackForCorrectness } from '@pie-lib/pie-toolbox/feedback';
import { lockChoices, getShuffledChoices, partialScoring } from '@pie-lib/pie-toolbox/controller-utils';
import Translator from '@pie-lib/pie-toolbox/translator';

const { translator } = Translator;
import defaults from './defaults';
import { isAlternateDuplicated, isCorrectResponseDuplicated } from './utils';

// eslint-disable-next-line no-console

export { score };

// PD-2960: make sure we don't have alternates in model or possibility to add them (temporary solution)
// this function is used in configure part, too
const disableAlternateResponses = (question) => {
  let { correctResponse } = question || {};
  correctResponse = correctResponse || [];
  const mappedCorrectResponse = correctResponse.map((cr) => {
    const { alternateResponses, ...response } = cr;
    return response;
  });
  return {
    ...question,
    correctResponse: mappedCorrectResponse,
    allowAlternateEnabled: false,
  };
};

export const getPartialScore = (correctResponse, builtCategories) => {
  // in the resulted best scenario we make a sum with all the correct responses
  // and all the placements
  const { placements, score } = builtCategories.reduce(
    (acc, { choices = [] }) => ({
      placements: acc.placements + choices.length,
      score: acc.score + choices.filter((ch) => ch.correct).length,
    }),
    { placements: 0, score: 0 },
  );

  // in the correct response, we make a sum of the max possible score
  const { maxScore } = correctResponse.reduce(
    (acc, { choices }) => ({
      maxScore: acc.maxScore + choices.length,
    }),
    { maxScore: 0 },
  );

  // if there are any extra placements, we subtract from the obtained score
  const extraPlacements = placements > maxScore ? placements - maxScore : 0;
  const totalScore = (score - extraPlacements) / maxScore;

  return totalScore < 0 ? 0 : parseFloat(totalScore.toFixed(2));
};

const getAlternates = (correctResponse) =>
  correctResponse.map((c) => c.alternateResponses).filter((alternate) => alternate);

export const getTotalScore = (question, session, env) => {
  if (!session) {
    return 0;
  }

  if (Object.keys(session).length === 0) {
    return 0;
  }
  const { categories, choices } = question || {};
  let { correctResponse } = question || {};
  let { answers } = session || {};
  answers = answers || [];
  correctResponse = correctResponse || [];

  // this function is used in pie-ui/categorize as well, in order to get the best scenario
  // so we get the best scenario and calculate the score
  const { categories: builtCategories, correct } = buildState(categories, choices, answers, correctResponse);

  const alternates = getAlternates(correctResponse);
  const enabled = partialScoring.enabled(question, env);

  // if there are any alternates, there will be no partial scoring!
  if (enabled && !alternates.length) {
    // we apply partial scoring
    return getPartialScore(correctResponse, builtCategories);
  }

  // else we apply dichotomous
  return correct ? 1 : 0;
};

export const getCorrectness = (question, session, env) => {
  return new Promise((resolve) => {
    if (env.mode === 'evaluate') {
      const score = getTotalScore(question, session, env);
      if (score === 1) {
        resolve('correct');
      } else if (score === 0) {
        resolve('incorrect');
      } else {
        resolve('partially-correct');
      }
    } else {
      resolve(undefined);
    }
  });
};

export const createDefaultModel = (model = {}) =>
  new Promise((resolve) => {
    resolve({
      ...defaults,
      ...model,
    });
  });

export const normalize = (question) => {
  const newQuestion = disableAlternateResponses(question);
  return {
    ...defaults,
    ...newQuestion,
  };
};

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export const model = (question, session, env, updateSession) =>
  new Promise(async (resolve) => {
    const normalizedQuestion = normalize(question);
    const answerCorrectness = await getCorrectness(normalizedQuestion, session, env);

    const { mode, role } = env || {};

    const {
      categories,
      categoriesPerRow,
      choicesLabel,
      choicesPosition,
      correctResponse,
      feedback,
      feedbackEnabled,
      promptEnabled,
      prompt,
      rowLabels,
      rationaleEnabled,
      rationale,
      teacherInstructionsEnabled,
      teacherInstructions,
      language,
      maxChoicesPerCategory,
    } = normalizedQuestion;
    let { choices, note } = normalizedQuestion;
    let fb;

    const lockChoiceOrder = lockChoices(normalizedQuestion, session, env);

    const filteredCorrectResponse = correctResponse.map((response) => {
      const filteredChoices = (response.choices || []).filter((choice) => choice !== 'null');
      return { ...response, choices: filteredChoices };
    });

    if (mode === 'evaluate' && feedbackEnabled) {
      fb = await getFeedbackForCorrectness(answerCorrectness, feedback);
    }

    if (!lockChoiceOrder) {
      choices = await getShuffledChoices(choices, session, updateSession, 'id');
    }

    if (!note) {
      note = translator.t('common:commonCorrectAnswerWithAlternates', { lng: language });
    }

    const alternates = getAlternates(filteredCorrectResponse);
    const out = {
      categories: categories || [],
      categoriesPerRow: categoriesPerRow || 2,
      maxChoicesPerCategory,
      correctness: answerCorrectness,
      choices: choices || [],
      choicesLabel: choicesLabel || '',
      choicesPosition,
      disabled: mode !== 'gather',
      feedback: fb,
      lockChoiceOrder,
      prompt: promptEnabled ? prompt : null,
      rowLabels,
      note,
      env,
      showNote: alternates && alternates.length > 0,
      correctResponse: mode === 'evaluate' ? filteredCorrectResponse : undefined,
      language
    };

    if (role === 'instructor' && (mode === 'view' || mode === 'evaluate')) {
      out.rationale = rationaleEnabled ? rationale : null;
      out.teacherInstructions = teacherInstructionsEnabled ? teacherInstructions : null;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
    }

    resolve(out);
  });

export const outcome = (question, session, env) => {
  if (env.mode !== 'evaluate') {
    return Promise.reject(new Error('Can not call outcome when mode is not evaluate'));
  } else {
    return new Promise((resolve) => {
      resolve({
        score: getTotalScore(question, session, env),
        empty: !session || isEmpty(session),
      });
    });
  }
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    const { mode, role } = env || {};

    if (mode !== 'evaluate' && role === 'instructor') {
      const { correctResponse } = question;

      resolve({ answers: correctResponse, id: 1 });
    } else {
      return resolve(null);
    }
  });
};

const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

export const validate = (model = {}, config = {}) => {
  const { categories, choices, correctResponse } = model;
  const {
    minChoices = 1,
    maxChoices = 15,
    minCategories = 1,
    maxCategories = 12,
    maxLengthPerChoice = 300,
    maxLengthPerCategory = 150,
  } = config;
  const reversedChoices = [...(choices || [])].reverse();
  const errors = {};
  const choicesErrors = {};
  const categoriesErrors = {};

  ['teacherInstructions', 'prompt', 'rationale'].forEach((field) => {
    if (config[field]?.required && !getInnerText(model[field])) {
      errors[field] = 'This field is required';
    }
  });

  (categories || []).forEach((category) => {
    const { id, label } = category;
    const parsedLabel = label.replace(/<(?:.|\n)*?>/gm, '');
    if (parsedLabel.length > maxLengthPerCategory) {
      categoriesErrors[id] = `Category labels should be no more than ${maxLengthPerCategory} characters long.`;
    }
  });

  (reversedChoices || []).forEach((choice, index) => {
    const { id, content } = choice;
    const parsedContent = content.replace(/<(?:.|\n)*?>/gm, '');
    if (parsedContent.length > maxLengthPerChoice) {
      choicesErrors[id] = `Tokens should be no more than ${maxLengthPerChoice} characters long.`;
    }
    if (!getInnerText(content)) {
      choicesErrors[id] = 'Tokens should not be empty.';
    } else {
      const identicalAnswer = reversedChoices.slice(index + 1).some((c) => c.content === content);

      if (identicalAnswer) {
        choicesErrors[id] = 'Tokens content should be unique.';
      }
    }
  });

  const nbOfCategories = (categories || []).length;
  const nbOfChoices = (choices || []).length;

  if (nbOfCategories > maxCategories) {
    errors.categoriesError = `No more than ${maxCategories} categories should be defined.`;
  } else if (nbOfCategories < minCategories) {
    errors.categoriesError = `There should be at least ${minCategories} category defined.`;
  }

  if (nbOfChoices < minChoices) {
    errors.choicesError = `There should be at least ${minChoices} choices defined.`;
  } else if (nbOfChoices > maxChoices) {
    errors.choicesError = `No more than ${maxChoices} choices should be defined.`;
  }

  if (nbOfChoices && nbOfCategories) {
    let hasAssociations = false;

    (correctResponse || []).forEach((response) => {
      const { choices = [], alternateResponses = [] } = response;

      if (choices.length) {
        hasAssociations = true;
      } else {
        alternateResponses.forEach((alternate) => {
          if ((alternate || []).length) {
            hasAssociations = true;
          }
        });
      }
    });

    let duplicateAlternateIndex = -1;
    let duplicateCategory = '';
    (correctResponse || []).forEach((response) => {
      const { choices = [], alternateResponses = [], category } = response;
      if (duplicateAlternateIndex === -1) {
        duplicateAlternateIndex = isCorrectResponseDuplicated(choices, alternateResponses);
        if (duplicateAlternateIndex === -1) {
          duplicateAlternateIndex = isAlternateDuplicated(alternateResponses);
        }
        duplicateCategory = category;
      }
    });

    if (duplicateAlternateIndex > -1) {
      errors.duplicateAlternate = { index: duplicateAlternateIndex, category: duplicateCategory };
    }

    if (!hasAssociations) {
      errors.associationError = 'At least one token should be assigned to at least one category.';
    }
  }

  if (!isEmpty(choicesErrors)) {
    errors.choicesErrors = choicesErrors;
  }

  if (!isEmpty(categoriesErrors)) {
    errors.categoriesErrors = categoriesErrors;
  }

  return errors;
};
