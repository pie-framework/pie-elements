import { flattenCorrect, getAllCorrectResponses, score } from './scoring';

import _ from 'lodash';
import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { partialScoring } from '@pie-lib/controller-utils';
import defaults from './defaults';

const log = debug('@pie-element:placement-ordering-controller');
export const questionError = () =>
  new Error('Question is missing required array: correctResponse');
export function outcome(question, session, env) {
  session.value = session.value || [];
  return new Promise((resolve, reject) => {
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

/**
 * remove any ids from the stashed shuffle that arent in choices
 * @param {*} choices
 * @param {*} shuffled
 */
function normalize(choices, shuffled) {
  return (
    shuffled && shuffled.filter(s => choices.findIndex(c => c.id === s) !== -1)
  );
}

/**
 * If there is a shuffled order stored in the session, restore it. Otherwise shuffle
 * all choices which do not have their shuffle property explicitly set to false.
 *
 * TODO: need to add a method to `model`: `saveSession: (session) => Promise<session>`
 * To allow the shuffle to be persisted.
 */
function shuffle(session, choices) {
  const { stash } = session;
  const { shuffledOrder } = stash || {};

  if (shuffledOrder && shuffledOrder.length !== choices.length) {
    delete session.stash.shuffledOrder;
  }

  const stashedShuffle = normalize(
    choices,
    session.stash && session.stash.shuffledOrder
  );

  if (stashedShuffle) {
    return stashedShuffle.map(choiceId => {
      return choices.find(c => c.id === choiceId);
    });
  } else {
    let result = _.cloneDeep(choices);

    for (var i = choices.length - 1; i >= 0; i--) {
      if (choices[i].lockChoiceOrder === true) {
        result.splice(i, 1);
      }
    }

    let shuffled = _.shuffle(_.cloneDeep(result));

    choices.forEach((choice, index) => {
      if (choice.lockChoiceOrder === true) {
        shuffled.splice(index, 0, choice);
      }
    });

    session.stash = session.stash || {};
    session.stash.shuffledOrder = shuffled.map(({ id }) => id);

    return shuffled;
  }
}

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      ...defaults,
      ...model
    });
  });
}

export function model(question, session, env) {
  return new Promise(resolve => {
    const base = {};

    base.outcomes = [];

    base.completeLength = (question.correctResponse || []).length;

    const choices = question.lockChoiceOrder
      ? question.choices
      : shuffle(session, question.choices);

    base.choices = choices;

    log('[model] removing tileSize for the moment.');

    base.prompt = question.prompt;
    base.config = {
      orientation: question.orientation || 'vertical',
      includeTargets: question.placementArea,
      targetLabel: question.targetLabel,
      choiceLabel: question.choiceLabel,
      showOrdering: question.numberedGuides,
      allowSameChoiceInTargets: !question.removeTilesAfterPlacing
    };

    base.disabled = env.mode !== 'gather';

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      base.rationale = question.rationale;
      base.teacherInstructions = question.teacherInstructions;
    } else {
      base.rationale = null;
      base.teacherInstructions = null;
    }

    if (env.mode === 'evaluate' && question.allowFeedback) {
      const allCorrectResponses = getAllCorrectResponses(question);

      const bestSetOfResponses = allCorrectResponses.reduce((info, cr) => {
        const currentScore = _.reduce(session.value, (acc, c, idx) => acc + (cr[idx] === c ? 1 : 0), 0);

        if (currentScore > info.score) {
          return {
            arr: cr,
            score: currentScore
          };
        }

        return info;
      }, { arr: [], score: 0 });

      base.outcomes = _.map(session.value, function(c, idx) {
        return {
          id: c,
          outcome: bestSetOfResponses.arr[idx] === c ? 'correct' : 'incorrect'
        };
      });

      const allCorrect = allCorrectResponses.reduce((correct, cr) => {
        if (_.isEqual(cr, session.value)) {
          return true;
        }

        return correct;
      }, false);

      base.correctness = allCorrect ? 'correct' : 'incorrect';

      if (!allCorrect) {
        base.correctResponse = flattenCorrect(question);
      }

      getFeedbackForCorrectness(base.correctness, question.feedback).then(
        feedback => {
          base.feedback = feedback;
          resolve(base);
        }
      );
    } else {
      resolve(base);
    }
  });
}
