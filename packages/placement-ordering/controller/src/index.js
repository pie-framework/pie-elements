import { flattenCorrect, score } from './scoring';

import _ from 'lodash';
import debug from 'debug';

const log = debug('@pie-element:placement-ordering-controller');

export function outcome(question, session, env) {
  session.value = session.value || [];
  return new Promise((resolve, reject) => {
    if (!question || !question.correctResponse || _.isEmpty(question.correctResponse)) {
      reject(new Error('Question is missing required array: correctResponse'));
    } else {
      resolve({
        score: {
          scaled: score(question, session)
        }
      });
    }
  });
}


const getFeedback = (correctness, fb) => {

  const type = fb[`${correctness}FeedbackType`] || 'none';
  if (type === 'default') {
    return defaultFeedback[correctness];
  } else if (type === 'custom') {
    return fb[`${correctness}Feedback`];
  }
}

export function model(question, session, env) {


  const config = _.assign({
    choiceAreaLayout: 'vertical',
    placementType: undefined,
    answerAreaLabel: undefined,
    choiceAreaLabel: undefined,
    showOrdering: true
  }, question.config);

  /**
   * remove any ids from the stashed shuffle that arent in choices 
   * @param {*} choices 
   * @param {*} shuffled 
   */
  function normalize(choices, shuffled) {
    return shuffled && shuffled.filter(s => choices.findIndex(c => c.id === s) !== -1);
  }

  /**
   * If there is a shuffled order stored in the session, restore it. Otherwise shuffle
   * all choices which do not have their shuffle property explicitly set to false. 
   * 
   * TODO: need to add a method to `model`: `saveSession: (session) => Promise<session>`
   * To allow the shuffle to be persisted.
   */
  function shuffle(session, choices) {

    const stashedShuffle = normalize(choices, session.stash && session.stash.shuffledOrder);
    if (stashedShuffle) {
      return stashedShuffle.map((choiceId) => {
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

  const base = _.assign({}, _.cloneDeep(question.model));

  base.outcomes = [];
  base.completeLength = question.correctResponse.length;

  const choices = question.config && question.config.shuffle ? shuffle(session, base.choices) : base.choices;
  base.choices = choices;

  log('[model] removing tileSize for the moment.');

  base.config = {
    orientation: config.choiceAreaLayout,
    includeTargets: config.placementType === 'placement',
    targetLabel: config.answerAreaLabel,
    choiceLabel: config.choiceAreaLabel,
    showOrdering: config.showOrdering
  }

  base.disabled = env.mode !== 'gather';

  if (env.mode === 'evaluate') {
    base.outcomes = _.map(session.value, function (c, idx) {
      return {
        id: c,
        outcome: flattenCorrect(question)[idx] === c ? 'correct' : 'incorrect'
      }
    });
    var allCorrect = _.isEqual(flattenCorrect(question), session.value);

    base.correctness = allCorrect ? 'correct' : 'incorrect';

    const defaultFeedback = _.assign({
      correct: 'Correct',
      incorrect: 'Incorrect'
    }, question.defaultFeedback);

    base.feedback = getFeedback(base.correctness, question.feedback || {}, defaultFeedback);

    if (!allCorrect) {
      base.correctResponse = flattenCorrect(question);
    }
  }

  //base.env = env;

  return Promise.resolve(base);
}