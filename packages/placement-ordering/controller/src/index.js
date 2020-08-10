import { flattenCorrect, getAllCorrectResponses, score } from './scoring';

import _ from 'lodash';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { lockChoices, getShuffledChoices, partialScoring } from '@pie-lib/controller-utils';
import debug from 'debug';

import defaults from './defaults';

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
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export function model(question, session, env, updateSession) {
  return new Promise(async resolve => {
    const normalizedQuestion = normalize(question);
    const base = {};
    let choices = normalizedQuestion.choices;

    base.outcomes = [];
    base.completeLength = (normalizedQuestion.correctResponse || []).length;

    const lockChoiceOrder = lockChoices(normalizedQuestion, session, env);

    if (!lockChoiceOrder) {
      choices = await getShuffledChoices(
        choices,
        session,
        updateSession,
        'label'
      );

      if (!session.shuffledValues) {
          session.value = choices.map(m => m.id);
      }
    }

    base.choices = choices;

    log('[model] removing tileSize for the moment.');

    base.prompt = normalizedQuestion.promptEnabled
      ? normalizedQuestion.prompt
      : null;
    base.config = {
      orientation: normalizedQuestion.orientation || 'vertical',
      includeTargets: normalizedQuestion.placementArea,
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

    if (env.mode === 'evaluate' && normalizedQuestion.feedbackEnabled) {
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

      getFeedbackForCorrectness(
        base.correctness,
        normalizedQuestion.feedback
      ).then(feedback => {
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
      const { choices } = question;
      const value = choices.map(c => c.id);

      resolve({
        id: '1',
        value
      });
    } else {
      resolve(null);
    }
  });
};
