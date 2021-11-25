import map from 'lodash/map';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import debug from 'debug';
import { partialScoring } from '@pie-lib/controller-utils';

const log = debug('explicit-constructed-response:controller');

export const prepareChoice = (mode, defaultFeedback) => choice => {
  const out = {
    label: choice.label,
    value: choice.value
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

const getFeedback = value => {
  if (value) {
    return 'correct';
  }

  return 'incorrect';
};

// also used in configure/src/markupUtils.js
const getAdjustedLength = length => {
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

export const normalize = question => ({
  rationaleEnabled: true,
  promptEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 */
export function model(question, session, env) {
  return new Promise(async resolve => {
    // this was added to treat an exception, when the model has choices without the "value" property
    // like: { label: 'test' }
    if (question.choices) {
      Object.keys(question.choices).forEach(key => {
        question.choices[key] = (question.choices[key] || []).map((item, index) => {
          if (!item.value) {
            log('Choice does not contain "value" property, which is required.', item);
            return { value: `${index}`, ...item };
          }

          return item;
        })
      });
    }

    const normalizedQuestion = normalize(question);
    const defaultFeedback = Object.assign(
      { correct: 'Correct', incorrect: 'Incorrect' },
      normalizedQuestion.defaultFeedback
    );

    const { value = {} } = session || {};

    const preparChoiceFn = prepareChoice(env.mode, defaultFeedback);

    let choices = reduce(
      normalizedQuestion.choices,
      (obj, area, key) => {
        obj[key] = map(area, preparChoiceFn);

        return obj;
      },
      {}
    );
    let feedback = {};

    if (env.mode === 'evaluate') {
      feedback = reduce(normalizedQuestion.choices, (obj, respArea, key) => {
        const chosenValue = value && value[key];
        const val = !isEmpty(chosenValue) && find(respArea, c => prepareVal(c.label) === prepareVal(chosenValue));

        obj[key] = getFeedback(val);

        return obj;
      }, {});
    }

    let showNote = false;
    // check if a choice has an alternate
    Object.values(choices).forEach(choice => {
       if (choice && choice.length > 1) {
         showNote = true;
       }
    });

    const { maxLengthPerChoice = [], maxLengthPerChoiceEnabled } = normalizedQuestion;
    const undefinedLengths = !maxLengthPerChoice.length;

    // calculate maxLengthPerChoice array if it is not defined or defined incorrectly
    Object.values(choices).forEach((choice, index) => {
      const labelLengthsArr = (choice || []).map(choice => (choice.label || '').length);
      const length = getAdjustedLength(Math.max(...labelLengthsArr));

      if (undefinedLengths || !maxLengthPerChoice[index] || maxLengthPerChoice[index] < length) {
        maxLengthPerChoice[index] = length;
      }
    });

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
      markup: normalizedQuestion.markup,
      choices,
      feedback,
      env,
      note: normalizedQuestion.note,
      showNote,
      maxLengthPerChoice,
      maxLengthPerChoiceEnabled,
      responseCorrect:
        env.mode === 'evaluate' ? getScore(normalizedQuestion, session) === 1 : undefined
    };

    if (
      env.role === 'instructor' &&
      (env.mode === 'view' || env.mode === 'evaluate')
    ) {
      out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled ? normalizedQuestion.teacherInstructions : null;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
    }

    resolve(out);
  });
}

const getTextFromHTML = (html) => {
  return (html || '').replace(/<\/?[^>]+(>|$)/g, '');
};

export const prepareVal = html => {
  const value = getTextFromHTML(html);

  return value.trim();
};

export const getScore = (config, session) => {
  const { value } = session || {};

  if (!session || isEmpty(session) || !value) {
    return 0;
  }

  const responseAreas = config.markup && config.markup.match(/\{\{(.)\}\}/g);
  const maxScore = responseAreas ? responseAreas.length : 0;
  const correctCount = reduce(config.choices, (total, respArea, key) => {
    const chosenValue = value && value[key];

    if (isEmpty(chosenValue) || !find(respArea, c => prepareVal(c.label) === prepareVal(chosenValue))) {
      return total;
    }

    return total + 1;
  }, 0);

  const str = maxScore ? (correctCount / maxScore).toFixed(2) : 0;

  return parseFloat(str);
};

/**
 *
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
  return new Promise(resolve => {
    const partialScoringEnabled = partialScoring.enabled(model, env);
    const score = getScore(model, session);

    resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0, empty: isEmpty(session) });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question;
      const value = {};

      Object.keys(choices).forEach((key, i) => {
        value[i] = choices[key][0].label;
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
