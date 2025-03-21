import debug from 'debug';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { decode } from 'he';
import { partialScoring } from '@pie-lib/pie-toolbox/controller-utils';
import Translator from '@pie-lib/pie-toolbox/translator';
import defaults from './defaults';

const { translator } = Translator;

const log = debug('explicit-constructed-response:controller');

export const prepareChoice = (mode, defaultFeedback) => (choice) => {
  const out = {
    label: choice.label,
    value: choice.value,
  };

  if (mode === 'evaluate') {
    out.correct = true;

    const feedbackType = (choice.feedback && choice.feedback.type) || 'none';

    if (feedbackType === 'default') {
      out.feedback = defaultFeedback['correct'];
    } else if (feedbackType === 'custom') {
      out.feedback = choice.feedback.value;
    }
  }

  return out;
};

const getFeedback = (value) => {
  if (value) {
    return 'correct';
  }

  return 'incorrect';
};

// also used in configure/src/markupUtils.js
const getAdjustedLength = (length) => {
  if (length <= 2) {
    return length + 2;
  }

  if (length <= 4) {
    return length + 3;
  }

  if (length <= 6) {
    return length + 4;
  }

  return length + 5;
};

export const normalize = (question) => ({ ...defaults, ...question });

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 */
export function model(question, session, env) {
  return new Promise(async (resolve) => {
    // this was added to treat an exception, when the model has choices without
    // the "value" property like: { label: 'test' }
    if (question.choices) {
      Object.keys(question.choices).forEach((key) => {
        question.choices[key] = (question.choices[key] || []).map((item, index) => {
          if (!item.value) {
            log('Choice does not contain "value" property, which is required.', item);
            return { value: `${index}`, ...item };
          }

          return item;
        });
      });
    }

    const normalizedQuestion = normalize(question);
    const defaultFeedback = Object.assign(
      { correct: 'Correct', incorrect: 'Incorrect' },
      normalizedQuestion.defaultFeedback,
    );
    const prepareChoiceFn = prepareChoice(env.mode, defaultFeedback);
    const choices = reduce(
      normalizedQuestion.choices,
      (obj, area, key) => {
        obj[key] = map(area, prepareChoiceFn);

        return obj;
      },
      {},
    );

    const { value = {} } = session || {};
    const feedback =
      env.mode === 'evaluate'
        ? reduce(
            normalizedQuestion.choices,
            (obj, respArea, key) => {
              const chosenValue = value && value[key];
              const val =
                !isEmpty(chosenValue) && find(respArea, (c) => prepareVal(c.label) === prepareVal(chosenValue));

              obj[key] = getFeedback(val);

              return obj;
            },
            {},
          )
        : {};

    // check if at least one choice has an alternate
    const showNote = Object.values(choices).some((choice) => choice?.length > 1);
    const note =
      normalizedQuestion.note ||
      translator.t('common:commonCorrectAnswerWithAlternates', { lng: normalizedQuestion.language });

    const { maxLengthPerChoice = [], maxLengthPerChoiceEnabled } = normalizedQuestion;
    const undefinedLengths = !maxLengthPerChoice.length;

    // calculate maxLengthPerChoice array if it is not defined or defined incorrectly
    Object.values(choices).forEach((choice, index) => {
      const labelLengthsArr = (choice || []).map((choice) => (choice.label || '').length);
      const length = Math.max(...labelLengthsArr);

      if (
        undefinedLengths ||
        !maxLengthPerChoice[index] ||
        maxLengthPerChoice[index] < length ||
        maxLengthPerChoice[index] > length + 10
      ) {
        maxLengthPerChoice[index] = getAdjustedLength(length);
      }
    });

    const out = {
      choices,
      disabled: env.mode !== 'gather',
      displayType: normalizedQuestion.displayType,
      mode: env.mode,
      role: env.role,
      feedback,
      language: normalizedQuestion.language,
      markup: normalizedQuestion.markup,
      maxLengthPerChoice,
      maxLengthPerChoiceEnabled,
      note,
      playerSpellCheckEnabled: normalizedQuestion.playerSpellCheckEnabled,
      prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : defaults.prompt,
      rationale: defaults.rationale,
      responseCorrect: env.mode === 'evaluate' ? getScore(normalizedQuestion, session) === 1 : undefined,
      showNote,
      teacherInstructions: defaults.teacherInstructions,
      responseAreaInputConfiguration: normalizedQuestion.responseAreaInputConfiguration,
      extraCSSRules: normalizedQuestion.extraCSSRules,
    };

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : defaults.rationale;
      out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
        ? normalizedQuestion.teacherInstructions
        : defaults.teacherInstructions;
    }

    resolve(out);
  });
}

export const prepareVal = (html) => {
  return decodeHTML(getInnerText(html).trim());
};

export const getScore = (config, session) => {
  const { value } = session || {};

  if (!session || isEmpty(session) || !value) {
    return 0;
  }

  const responseAreas = config.markup && config.markup.match(/\{\{(.+?)\}\}/g);
  const maxScore = responseAreas ? responseAreas.length : 0;
  const correctCount = reduce(
    config.choices,
    (total, respArea, key) => {
      const chosenValue = value && value[key];

      if (isEmpty(chosenValue) || !find(respArea, (c) => prepareVal(c.label) === prepareVal(chosenValue))) {
        return total;
      }

      return total + 1;
    },
    0,
  );

  const str = maxScore ? (correctCount / maxScore).toFixed(2) : 0;

  return parseFloat(str);
};

/**
 * The score is partial by default for checkbox mode, allOrNothing for radio mode.
 * To disable partial scoring for checkbox mode you either set model.partialScoring = false or env.partialScoring =
 * false. the value in `env` will override the value in `model`.
 * @param {Object} model - the main model
 * @param {boolean} model.partialScoring - is partial scoring enabled (if undefined set to to true)
 * @param {*} session
 * @param {Object} env
 * @param {boolean} env.partialScoring - is partial scoring enabled (if undefined default to true) This overrides
 *   `model.partialScoring`.
 */
export function outcome(model, session, env = {}) {
  return new Promise((resolve) => {
    const partialScoringEnabled = partialScoring.enabled(model, env);
    const score = getScore(model, session);

    resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0, empty: isEmpty(session) });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question;
      const value = {};

      Object.keys(choices).forEach((key, i) => {
        value[i] = choices[key][0].label;
      });

      resolve({ id: '1', value });
    } else {
      resolve(null);
    }
  });
};

// remove all html tags
// const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');
const getInnerText = (html) => {
  if (typeof html !== 'string') {
    return '';
  }
  if (typeof html.replaceAll === 'function') {
    return html.replaceAll(/<[^>]*>/g, '');
  } else {
        // Polyfill for replaceAll using replace and a global regex
    return html.replace(/<[^>]*>/g, '');
  }
};

const decodeHTML = (html) => decode(html);

// remove all html tags except img and iframe
const getContent = (html) => (html || '').replace(/(<(?!img|iframe)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const { choices, markup } = model;
  const { maxResponseAreas } = config;
  const allChoicesErrors = {};
  const errors = {};

  ['teacherInstructions', 'prompt', 'rationale'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  Object.entries(choices || {}).forEach(([key, values]) => {
    const reversedChoices = [...(values || [])].reverse();
    const choicesErrors = {};

    reversedChoices.forEach((choice, index) => {
      const { value, label } = choice;

      if (label === '' || label === '<div></div>') {
        choicesErrors[value] = 'Content should not be empty.';
      } else {
        const identicalAnswer = reversedChoices.slice(index + 1).some((c) => c.label === label);

        if (identicalAnswer) {
          choicesErrors[value] = 'Content should be unique.';
        }
      }
    });

    if (!isEmpty(choicesErrors)) {
      allChoicesErrors[key] = choicesErrors;
    }
  });

  const nbOfResponseAreas = (markup.match(/\{\{(\d+)\}\}/g) || []).length;

  if (nbOfResponseAreas > maxResponseAreas) {
    errors.responseAreas = `No more than ${maxResponseAreas} response areas should be defined.`;
  } else if (nbOfResponseAreas < 1) {
    errors.responseAreas = 'There should be at least 1 response area defined.';
  }

  if (!isEmpty(allChoicesErrors)) {
    errors.choices = allChoicesErrors;
  }

  return errors;
};
