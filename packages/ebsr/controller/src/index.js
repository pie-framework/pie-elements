import debug from 'debug';
import shuffle from 'lodash/shuffle';
import defaults from './defaults';
import { isResponseCorrect } from './utils';

const log = debug('pie-elements:ebsr:controller');

const prepareChoice = (env, defaultFeedback) => choice => {
  const out = {
    label: choice.label,
    value: choice.value
  };

  if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
    out.rationale = choice.rationale;
  } else {
    out.rationale = null;
  }

  if (env.mode === 'evaluate') {
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

const parsePart = (part, key, session, env) => {
  const defaultFeedback = Object.assign(
    { correct: 'Correct', incorrect: 'Incorrect' },
    part.defaultFeedback
  );

  let choices = part.choices.map(
    prepareChoice(env, defaultFeedback)
  );

  if (!part.lockChoiceOrder) {
    choices = shuffle(choices);
  }

  return {
    ...part,
    choices,
    disabled: env.mode !== 'gather',
    complete: {
      min: part.choices.filter(c => c.correct).length
    },
    responseCorrect:
      env.mode === 'evaluate'
        ? isResponseCorrect(part, key, session)
        : undefined
  }
};

export function model(question, session, env) {
  return new Promise((resolve, reject) => {
    resolve({
      disabled: env.mode !== 'gather',
      mode: env.mode,
      partA: parsePart(question.partA, 'partA', session, env),
      partB: parsePart(question.partB, 'partB', session, env),
    });
  });
}

export const createDefaultModel = (model = {}) =>
  new Promise(resolve => {
    resolve({
      ...defaults,
      ...model,
    })
  });

const isCorrect = c => c.correct === true;

const getScore = (config, part, key) => {
  let score;

  const maxScore = config[key].choices.length;
  const chosen = c => !!(part.value || []).find(v => v === c.value);
  const correctAndNotChosen = c => isCorrect(c) && !chosen(c);
  const incorrectAndChosen = c => !isCorrect(c) && chosen(c);
  const correctCount = config[key].choices.reduce((total, choice) => {
    if (correctAndNotChosen(choice) || incorrectAndChosen(choice)) {
      return total - 1;
    } else {
      return total;
    }
  }, config[key].choices.length);

  if (!config[key].partialScoring && correctCount < maxScore) {
    score = 0;
  } else {
    const scoreString = ( correctCount / config[key].choices.length ).toFixed(2);

    score = parseFloat( scoreString );
  }

  return score;
};

export function outcome(config, session, env) {
  return new Promise((resolve, reject) => {
    log('outcome...');

    const { value } = session;

    if (value) {
      const { partA, partB } = value;

      const scoreA = getScore(config, partA, 'partA');
      const scoreB = scoreA ? getScore(config, partB, 'partB') : 0;

      const score = scoreA + scoreB;

      resolve({ score, scoreA, scoreB });
    }
  });
}
