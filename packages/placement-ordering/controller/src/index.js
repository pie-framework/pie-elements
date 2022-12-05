import { flattenCorrect, getAllCorrectResponses, score } from './scoring';

import _ from 'lodash';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { partialScoring } from '@pie-lib/controller-utils';
import debug from 'debug';

import defaults from './defaults';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

const log = debug('@pie-element:placement-ordering:controller');

export const questionError = () =>
  new Error('Question is missing required array: correctResponse');

export function outcome(question, session, env) {
  return new Promise((resolve, reject) => {
    if (!session || _.isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    if (
      !question ||
      !question.correctResponse ||
      _.isEmpty(question.correctResponse)
    ) {
      reject(questionError());
    } else {
      try {
        const s = score(question, session);
        const finalScore = partialScoring.enabled(question, env || {})
          ? s
          : s === 1
          ? 1
          : 0;
        resolve({
          score: finalScore
        });
      } catch (e) {
        reject(e);
      }
    }
  });
}

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
  rationaleEnabled: true,
  feedbackEnabled: true,
  promptEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question
});

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 */
export function model(question, session, env) {
  return new Promise(async resolve => {
    const normalizedQuestion = normalize(question);
    const base = {};

    if (question.alternateResponses && _.every(question.alternateResponses, _.isArray)) {
      log('Deprecated structure of alternateResponses is in use');
      console.error('Deprecated structure of alternateResponses is in use');
    }

    base.env = env;
    base.outcomes = [];
    base.completeLength = (normalizedQuestion.correctResponse || []).length;
    base.choices = (normalizedQuestion.choices || []).filter(choice => choice.label);
    base.note = normalizedQuestion.note;
    base.showNote = normalizedQuestion.alternateResponses && normalizedQuestion.alternateResponses.length > 0;

    log('[model] removing tileSize for the moment.');

    base.prompt = normalizedQuestion.promptEnabled
      ? normalizedQuestion.prompt
      : null;
    base.config = {
      orientation: normalizedQuestion.orientation || 'vertical',
      includeTargets: normalizedQuestion.placementArea,
      choiceLabelEnabled: normalizedQuestion.choiceLabelEnabled,
      targetLabel: normalizedQuestion.targetLabel,
      choiceLabel: normalizedQuestion.choiceLabel,
      showOrdering: normalizedQuestion.numberedGuides,
      allowSameChoiceInTargets: !normalizedQuestion.removeTilesAfterPlacing
    };

    base.disabled = env.mode !== 'gather';

    if (
      env.role === 'instructor' &&
      (env.mode === 'view' || env.mode === 'evaluate')
    ) {
      base.rationale = normalizedQuestion.rationaleEnabled
        ? normalizedQuestion.rationale
        : null;
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
          const currentScore = _.reduce(
            value,
            (acc, c, idx) => acc + (cr[idx] === c ? 1 : 0),
            0
          );

          if (currentScore > info.score) {
            return {
              arr: cr,
              score: currentScore
            };
          }

          return info;
        },
        { arr: [], score: 0 }
      );

      base.outcomes = _.map(value, function(c, idx) {
        return {
          id: c,
          outcome: bestSetOfResponses.arr[idx] === c ? 'correct' : 'incorrect'
        };
      });

      const allCorrect = allCorrectResponses.reduce((correct, cr) => {
        if (_.isEqual(cr, value)) {
          return true;
        }

        return correct;
      }, false);

      base.correctness = allCorrect ? 'correct' : 'incorrect';

      if (!allCorrect) {
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
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      resolve({
        id: '1',
        value: flattenCorrect(question)
      });
    } else {
      resolve(null);
    }
  });
};

export const validate = (model = {}, config = {}) => {
  const { choices, correctResponse } = model;
  const errors = {};

  const reversedChoices = [...choices || []].reverse();
  const choicesErrors = {};

  reversedChoices.forEach((choice, index) => {
    const { id, label } = choice;

    if (label === '' || label === '<div></div>') {
      choicesErrors[id] = 'Content should not be empty.';
    } else {
      const identicalAnswer = reversedChoices.slice(index + 1).some(c => c.label === label);

      if (identicalAnswer) {
        choicesErrors[id] = 'Content should be unique.';
      }
    }
  });

  const choicesIds = (choices || []).map(choice => choice.id);
  const correctResponseIds = (correctResponse || []).map(response => response.id || response);

  if (isEqual(choicesIds, correctResponseIds)) {
    errors.orderError = 'The correct ordering should not be identical to the initial ordering.';
  }

  if (!isEmpty(choicesErrors)) {
    errors.choicesErrors = choicesErrors;
  }

  return errors;
};
