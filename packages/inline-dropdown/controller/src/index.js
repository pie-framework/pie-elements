import map from 'lodash/map';
import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';
import { lockChoices, getShuffledChoices, partialScoring } from '@pie-lib/controller-utils';
import defaults from './defaults';

import { getAllCorrectResponses } from './utils';

const getFeedback = (correct) => {
  if (correct) {
    return 'correct';
  }

  return 'incorrect';
};

export const normalize = (question) => ({ ...defaults, ...question });

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export function model(question, session, env, updateSession) {
  return new Promise(async (resolve) => {
    const normalizedQuestion = normalize(question);
    const { value = {} } = session || {};
    let choices = reduce(
      normalizedQuestion.choices,
      (obj, area, key) => {
        obj[key] = map(area, (choice) => choice);

        return obj;
      },
      {},
    );

    let feedback = {};

    if (env.mode === 'evaluate') {
      const allCorrectResponses = getAllCorrectResponses(normalizedQuestion);
      const respAreaLength = Object.keys(allCorrectResponses).length;
      let correctResponses = 0;

      for (let i = 0; i < respAreaLength; i++) {
        const result = reduce(
          allCorrectResponses,
          (obj, choices, key) => {
            const answer = (value && value[key]) || '';
            const correctChoice = choices[i] || '';
            const isCorrect = answer && correctChoice && correctChoice === answer;

            obj.feedback[key] = getFeedback(isCorrect);

            if (isCorrect) {
              obj.correctResponses += 1;
            }

            return obj;
          },
          { correctResponses: 0, feedback: {} },
        );

        if (result.correctResponses >= correctResponses) {
          correctResponses = result.correctResponses;
          feedback = result.feedback;
        }

        if (result.correctResponses === respAreaLength) {
          break;
        }
      }
    }

    const lockChoiceOrder = lockChoices(normalizedQuestion, session, env);

    if (!lockChoiceOrder) {
      const shuffledValues = {};
      const keys = Object.keys(choices);

      const us = (part) => (id, element, update) => {
        return new Promise((resolve) => {
          shuffledValues[part] = update.shuffledValues;
          resolve();
        });
      };

      let i;

      for (i = 0; i < keys.length; i++) {
        const key = keys[i];
        const storedValues = session?.shuffledValues?.[key];

        choices[key] = await getShuffledChoices(
          choices[key],
          // the shuffledValues structure was updated to an object like { choice_key: [] }
          // and we need to override shuffledValues if it's not an array
          { shuffledValues: Array.isArray(storedValues) ? storedValues : [] },
          us(key),
          'value',
        );
      }

      if (!isEmpty(shuffledValues)) {
        if (session && updateSession && typeof updateSession === 'function') {
          updateSession(session.id, session.element, {
            shuffledValues,
          }).catch((e) => {
            // eslint-disable-next-line no-console
            console.error('update session failed', e);
          });
        }
      }
    }

    let teacherInstructions = null;
    let rationale = null;

    const choicesWillNullRationales = (Object.keys(choices) || []).reduce((acc, currentValue) => {
      acc[currentValue] = (choices[currentValue] || []).map((choice) => ({
        ...choice,
        rationale: null,
      }));

      return acc;
    }, {});

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
        ? normalizedQuestion.teacherInstructions
        : null;

      choices = normalizedQuestion.choiceRationaleEnabled ? normalizedQuestion.choices : choicesWillNullRationales;
    } else {
      rationale = null;
      teacherInstructions = null;
      choices = choicesWillNullRationales;
    }

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
      displayType: normalizedQuestion.displayType,
      markup: normalizedQuestion.markup,
      choices,
      feedback,

      responseCorrect: env.mode === 'evaluate' ? getScore(normalizedQuestion, session) === 1 : undefined,
      rationale,
      teacherInstructions,
      language: normalizedQuestion.language,
      extraCSSRules: normalizedQuestion.extraCSSRules,
    };

    resolve(out);
  });
}

export const getScore = (config, session) => {
  const { value = {} } = session || {};
  const maxScore = config && config.choices ? Object.keys(config.choices).length : 0;
  const allCorrectResponses = getAllCorrectResponses(config);
  let correctCount = 0;

  for (let i = 0; i < maxScore; i++) {
    const result = reduce(
      allCorrectResponses,
      (total, choices, key) => {
        const answer = (value && value[key]) || '';
        const correctChoice = choices[i] || '';

        if (correctChoice && answer && correctChoice === answer) {
          return total;
        }

        return total - 1;
      },
      maxScore,
    );

    if (result > correctCount) {
      correctCount = result;
    }

    if (result === maxScore) {
      break;
    }
  }

  const str = (correctCount / maxScore).toFixed(2);

  return parseFloat(str);
};

/**
 * Generates detailed trace log for scoring evaluation
 * @param {Object} model - the question model
 * @param {Object} session - the student session
 * @param {Object} env - the environment
 * @returns {Array} traceLog - array of trace messages
 */
export const getLogTrace = (model, session, env) => {
  const traceLog = [];
  const { value = {} } = session || {};
  const allCorrectResponses = getAllCorrectResponses(model);
  const responseAreaKeys = Object.keys(allCorrectResponses);
  const totalAreas = responseAreaKeys.length;
  
  traceLog.push(`${totalAreas} dropdown response area(s) defined in this question.`);
  
  if (value && Object.keys(value).length > 0) {
    const selectedAreas = Object.entries(value).filter(([key, val]) => val && val.trim()).length;
    traceLog.push(`Student selected options in ${selectedAreas} out of ${totalAreas} dropdown(s).`);
    
    responseAreaKeys.forEach((areaKey) => {
      const studentSelection = (value && value[areaKey]) || '';
      const correctOptions = allCorrectResponses[areaKey] || [];
      
      if (studentSelection.trim()) {
        traceLog.push(`Dropdown ${parseInt(areaKey) + 1}: student selected '${studentSelection}' (correct options: [${correctOptions.map(opt => `'${opt}'`).join(', ')}]).`);
      } else {
        traceLog.push(`Dropdown ${parseInt(areaKey) + 1}: no selection made (correct options: [${correctOptions.map(opt => `'${opt}'`).join(', ')}]).`);
      }
    });
  } else {
    traceLog.push('Student did not make any selections in the dropdowns.');
  }

  const partialScoringEnabled = partialScoring.enabled(model, env);
  traceLog.push(
    `Scoring method: ${
      partialScoringEnabled ? 'partial scoring' : 'all-or-nothing scoring'
    }.`
  );

  const score = getScore(model, session);
  traceLog.push(`Final score: ${score}.`);

  return traceLog;
}

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
  return new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ 
        score: 0, 
        empty: true, 
        traceLog: ['Student did not make any selections in the dropdowns. Score is 0.'] 
      });
    } else {
      const traceLog = getLogTrace(model, session, env);
      const score = getScore(model, session);
      const partialScoringEnabled = partialScoring.enabled(model, env);

      resolve({
        score: partialScoringEnabled ? score : Math.floor(score),
        empty: false,
        traceLog
      });
    }
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question;
      const value = {};

      if (choices) {
        Object.keys(choices).forEach((key, i) => {
          const correctChoices = choices[key] && choices[key].filter((c) => c.correct);

          value[i] = correctChoices && correctChoices[0].value;
        });
      }

      resolve({
        id: '1',
        value,
      });
    } else {
      resolve(null);
    }
  });
};

// remove all html tags
const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

// remove all html tags except img, iframe and source tag for audio
const getContent = (html) => (html || '').replace(/(<(?!img|iframe|source)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const { markup, choices } = model;
  const { maxResponseAreas, maxResponseAreaChoices } = config;
  const errors = {};

  ['teacherInstructions', 'prompt', 'rationale'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  const nbOfResponseAreas = ((markup || '').match(/\{\{(\d+)\}\}/g) || []).length;

  if (nbOfResponseAreas > maxResponseAreas) {
    errors.responseAreasError = `No more than ${maxResponseAreas} response areas should be defined.`;
  } else if (nbOfResponseAreas < 1) {
    errors.responseAreasError = 'There should be defined at least 1 response area.';
  }

  (Object.keys(choices) || []).forEach((choiceKey) => {
    if (choices[choiceKey] && choices[choiceKey].length > maxResponseAreaChoices) {
      errors.responseAreaChoicesError = `No more than ${maxResponseAreaChoices} choices per response area should be defined.`;
    }
  });

  return errors;
};
