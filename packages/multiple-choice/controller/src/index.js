import debug from 'debug';
import shuffle from 'lodash/shuffle';
import { isResponseCorrect } from './utils';
import defaults from './defaults';
import { partialScoring } from '@pie-lib/controller-utils';

const log = debug('pie-elements:multiple-choice:controller');

const prepareChoice = (mode, defaultFeedback) => choice => {
  const out = {
    label: choice.label,
    value: choice.value
  };

  if (mode === 'evaluate') {
    out.correct = !!choice.correct;

    const feedbackType = (choice.feedback && choice.feedback.type) || 'none';

    if (feedbackType === 'default') {
      out.feedback = defaultFeedback[choice.correct ? 'correct' : 'incorrect'];
    } else if (feedbackType === 'custom') {
      out.feedback = choice.feedback.value;
    }
  }

  return out;
};

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      ...defaults,
      ...model
    });
  });
}

export function model(question, session, env) {
  return new Promise((resolve, reject) => {
    const defaultFeedback = Object.assign(
      { correct: 'Correct', incorrect: 'Incorrect' },
      question.defaultFeedback
    );
    let choices = question.choices.map(
      prepareChoice(env.mode, defaultFeedback)
    );

    if (question.shuffle) {
      console.error(
        '!!! Warning - shuffling the model every time is bad, it should be stored in the session. see: https://app.clubhouse.io/keydatasystems/story/131/config-ui-support-shuffle-choices'
      );
      choices = shuffle(choices);
    }

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      prompt: question.prompt,
      choiceMode: question.choiceMode,
      keyMode: question.keyMode,
      shuffle: question.shuffle,
      choices,

      //TODO: ok to return this in gather mode? gives a clue to how many answers are needed?
      complete: {
        min: question.choices.filter(c => c.correct).length
      },
      responseCorrect:
        env.mode === 'evaluate'
          ? isResponseCorrect(question, session)
          : undefined
    };

    resolve(out);
  });
}

const isCorrect = c => c.correct === true;

const getScore = (config, session) => {
  const maxScore = config.choices.length;
  const chosen = c => !!(session.value || []).find(v => v === c.value);
  const correctAndNotChosen = c => isCorrect(c) && !chosen(c);
  const incorrectAndChosen = c => !isCorrect(c) && chosen(c);
  const correctCount = config.choices.reduce((total, choice) => {
    if (correctAndNotChosen(choice) || incorrectAndChosen(choice)) {
      return total - 1;
    } else {
      return total;
    }
  }, config.choices.length);

  const str = (correctCount / maxScore).toFixed(2);
  return parseFloat(str, 10);
};

/**
 *
 * The score is partial by default for checkbox mode, allOrNothing for radio mode.
 * To disable partial scoring for checkbox mode you either set config.partialScoring = false or env.partialScoring = false. the value in `env` will
 * override the value in `config`.
 * @param {Object} config - the main model
 * @param {boolean} config.partialScoring - is partial scoring enabled (if undefined set to to true)
 * @param {*} session
 * @param {Object} env
 * @param {boolean} env.partialScoring - is partial scoring enabled (if undefined default to true) This overrides `config.partialScoring`.
 */
export function outcome(config, session, env) {
  return new Promise(resolve => {
    const partialScoringEnabled =
      partialScoring.enabled(config, env) && config.choiceMode !== 'radio';
    const score = getScore(config, session);
    resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0 });
  });
}
