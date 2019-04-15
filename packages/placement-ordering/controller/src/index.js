import { flattenCorrect, score } from './scoring';

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
      if (choices[i].shuffle === false) {
        result.splice(i, 1);
      }
    }
    let shuffled = _.shuffle(_.cloneDeep(result));
    choices.forEach((choice, index) => {
      if (choice.shuffle === false) {
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

    const choices = question.shuffle
      ? shuffle(session, question.choices)
      : question.choices;
    base.choices = choices;

    log('[model] removing tileSize for the moment.');

    base.prompt = question.itemStem;
    base.config = {
      orientation: question.choicesOrientation || 'vertical',
      includeTargets: question.placementArea,
      targetLabel: question.targetLabel,
      choiceLabel: question.choiceLabel,
      showOrdering: question.numberedGuides,
      allowSameChoiceInTargets: !(
        question.configure && question.configure.removeTileAfterPlacing
      )
    };

    base.configure = question.configure;

    base.disabled = env.mode !== 'gather';

    if (env.mode === 'evaluate') {
      base.outcomes = _.map(session.value, function(c, idx) {
        return {
          id: c,
          outcome: flattenCorrect(question)[idx] === c ? 'correct' : 'incorrect'
        };
      });
      var allCorrect = _.isEqual(flattenCorrect(question), session.value);

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
