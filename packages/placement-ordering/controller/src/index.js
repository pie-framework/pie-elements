import { flattenCorrect, getAllCorrectResponses, score } from './scoring';

import _ from 'lodash';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { partialScoring } from '@pie-lib/controller-utils';
import debug from 'debug';

import defaults from './defaults';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

const log = debug('@pie-element:placement-ordering:controller');
import Translator from '@pie-lib/translator';

const { translator } = Translator;

export const questionError = () => new Error('Question is missing required array: correctResponse');

/**
 * Generates detailed trace log for placement-ordering scoring evaluation
 * @param {Object} question - the question model
 * @param {Object} session - the student session
 * @param {Object} env - the environment
 * @returns {Array<string>} traceLog
 */
export const getLogTrace = (question, session, env) => {
  const traceLog = [];

  const value = session?.value || [];
  const correctResponse = question?.correctResponse || [];
  const hasPlacementArea = question?.placementArea === true;

  if (!value.length) {
    if (hasPlacementArea) {
      traceLog.push('Student did not place any tiles in the target area.');
    } else {
      traceLog.push('Student did not reorder any tiles.');
    }
    traceLog.push('Final score: 0.');
    return traceLog;
  }

  const allCorrectResponses = getAllCorrectResponses(question);

  let bestMatch = { score: 0, response: [] };

  allCorrectResponses.forEach((cr) => {
    let matchCount = 0;
    value.forEach((v, idx) => {
      if (cr[idx] === v) {
        matchCount++;
      }
    });

    if (matchCount > bestMatch.score) {
      bestMatch = { score: matchCount, response: cr };
    }
  });

  const correctCount = bestMatch.score;
  const incorrectCount = value.length - correctCount;

  if (correctCount > 0) {
    traceLog.push(`${correctCount} tile(s) placed in the correct order.`);
    }

    if (incorrectCount > 0) {
    traceLog.push(`${incorrectCount} tile(s) placed in an incorrect order.`);
  }

  const isFullyCorrect = allCorrectResponses.some((cr) => isEqual(cr, value));

  const partialScoringEnabled = partialScoring.enabled(question, env || {});

  if (partialScoringEnabled) {
    traceLog.push('Score calculated using partial scoring.');
    traceLog.push(
      'Each tile placed in the correct position contributes to the score.',
    );
  } else {
    traceLog.push('Score calculated using all-or-nothing scoring.');
    if (hasPlacementArea) {
      traceLog.push(
        'Student must place all tiles in the correct positions within the target area to receive full credit.',
      );
    } else {
      traceLog.push(
        'Student must arrange all tiles in the correct order to receive full credit.',
      );
    }
  }

  const rawScore = score(question, session);
  const finalScore = partialScoringEnabled ? rawScore : rawScore === 1 ? 1 : 0;

  traceLog.push(`Final score: ${finalScore}.`);

  return traceLog;
};

export function outcome(question, session, env) {
  return new Promise((resolve, reject) => {
    if (!session || _.isEmpty(session)) {
      resolve({ 
        score: 0, 
        empty: true, 
        logTrace: ['Student did not interact with the placement-ordering item.'] 
      });
      return;
    }

    if (!question || !question.correctResponse || _.isEmpty(question.correctResponse)) {
      reject(questionError());
    } else {
      try {
        const s = score(question, session);
        const finalScore = partialScoring.enabled(question, env || {}) ? s : s === 1 ? 1 : 0;
        resolve({
          score: finalScore,
          logTrace: getLogTrace(question, session, env)
        });
      } catch (e) {
        reject(e);
      }
    }
  });
}

export function createDefaultModel(model = {}) {
  return new Promise((resolve) => {
    resolve({
      ...defaults,
      ...model,
    });
  });
}

export const normalize = (question) => ({
  ...defaults,
  rationaleEnabled: true,
  feedbackEnabled: false,
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
  return new Promise(async (resolve) => {
    const normalizedQuestion = normalize(question);
    const base = {};

    if (question.alternateResponses && _.every(question.alternateResponses, _.isArray)) {
      log('Deprecated structure of alternateResponses is in use');
      // eslint-disable-next-line no-console
      console.error('Deprecated structure of alternateResponses is in use');
    }

    base.env = env;
    base.extraCSSRules = normalizedQuestion.extraCSSRules;
    base.outcomes = [];
    base.completeLength = (normalizedQuestion.correctResponse || []).length;
    base.choices = (normalizedQuestion.choices || []).filter((choice) => choice.label);
    base.note = normalizedQuestion.note;
    base.showNote = normalizedQuestion.alternateResponses && normalizedQuestion.alternateResponses.length > 0;
    base.language = normalizedQuestion.language;

    log('[model] removing tileSize for the moment.');

    base.prompt = normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null;
    base.config = {
      orientation: normalizedQuestion.orientation || 'vertical',
      includeTargets: normalizedQuestion.placementArea,
      choiceLabelEnabled: normalizedQuestion.choiceLabelEnabled,
      targetLabel: normalizedQuestion.targetLabel,
      choiceLabel: normalizedQuestion.choiceLabel,
      showOrdering: normalizedQuestion.numberedGuides,
      allowSameChoiceInTargets: !normalizedQuestion.removeTilesAfterPlacing,
    };

    base.disabled = env.mode !== 'gather';

    if (!base.note) {
      base.note = translator.t('common:commonCorrectAnswerWithAlternates', { lng: normalizedQuestion.language });
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      base.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      base.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
        ? normalizedQuestion.teacherInstructions
        : null;
    } else {
      base.rationale = null;
      base.teacherInstructions = null;
    }

    if (env.mode === 'evaluate') {
      const value = (session && session.value) || [];
      const allCorrectResponses = getAllCorrectResponses(normalizedQuestion);

      const bestSetOfResponses = allCorrectResponses.reduce(
        (info, cr) => {
          const currentScore = _.reduce(value, (acc, c, idx) => acc + (Array.isArray(cr) && cr[idx] === c ? 1 : 0), 0);

          if (currentScore > info.score) {
            return {
              arr: cr,
              score: currentScore,
            };
          }

          return info;
        },
        { arr: [], score: 0 },
      );

      base.outcomes = _.map(value, (c, idx) => {
        return {
          id: c,
          outcome: bestSetOfResponses.arr[idx] === c ? 'correct' : 'incorrect',
        };
      });

      const isResponseCorrect = allCorrectResponses.some((response) => _.isEqual(response, value));
      const responseScore = score(question, session);
      const isCorrect = responseScore === 1;
      const isPartialCorrect =
        !isCorrect && partialScoring.enabled(normalizedQuestion, env || {}) && responseScore !== 0;

      base.correctness = isCorrect ? 'correct' : isPartialCorrect ? 'partial' : 'incorrect';

      if (!isResponseCorrect) {
        base.correctResponse = flattenCorrect(normalizedQuestion);
      }

      // requirement made in PD-2182
      if (!normalizedQuestion.feedback) {
        normalizedQuestion.feedbackEnabled = false;
      }

      const fb = normalizedQuestion.feedbackEnabled
        ? getFeedbackForCorrectness(base.correctness, normalizedQuestion.feedback)
        : Promise.resolve(undefined);

      fb.then((feedback) => {
        base.feedback = feedback;
        resolve(base);
      });
    } else {
      resolve(base);
    }
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      resolve({
        id: '1',
        value: flattenCorrect(question),
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
  const { choices, correctResponse } = model;
  const errors = {};

  ['teacherInstructions', 'prompt', 'rationale'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  const reversedChoices = [...(choices || [])].reverse();
  const choicesErrors = {};

  reversedChoices.forEach((choice, index) => {
    const { id, label } = choice;

    if (!getContent(label)) {
      choicesErrors[id] = 'Content should not be empty.';
    } else {
      const identicalAnswer = reversedChoices.slice(index + 1).some((c) => c.label === label);

      if (identicalAnswer) {
        choicesErrors[id] = 'Content should be unique.';
      }
    }
  });

  const choicesIds = (choices || []).map((choice) => choice.id);
  const correctResponseIds = (correctResponse || []).map((response) => response.id || response);

  if (isEqual(choicesIds, correctResponseIds)) {
    errors.orderError = 'The correct ordering should not be identical to the initial ordering.';
  }

  if (!isEmpty(choicesErrors)) {
    errors.choicesErrors = choicesErrors;
  }

  return errors;
};
