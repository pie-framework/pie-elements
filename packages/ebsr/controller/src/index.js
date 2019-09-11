import shuffle from 'lodash/shuffle';
import defaults from './defaults';
import { getShuffledChoices } from '@pie-lib/controller-utils';

import { isResponseCorrect } from './utils';

const lg = n => console[n].bind(console, '[ebsr]');
const log = lg('log');

const prepareChoice = (model, env, defaultFeedback) => choice => {
  const out = {
    label: choice.label,
    value: choice.value
  };

  if (
    env.role === 'instructor' &&
    (env.mode === 'view' || env.mode === 'evaluate')
  ) {
    out.rationale = choice.rationale;
  } else {
    out.rationale = null;
  }

  if (env.mode === 'evaluate' && model.allowFeedback) {
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

  let choices = part.choices
    ? part.choices.map(prepareChoice(part, env, defaultFeedback))
    : [];

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
  };
};

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export async function model(question, session, env, updateSession) {
  if (!question.partA.lockChoiceOrder) {
    question.partA.choices = await getShuffledChoices(question.partA.choices, session, updateSession, 'value');
  }

  if (!question.partB.lockChoiceOrder) {
    question.partB.choices = await getShuffledChoices(question.partB.choices, session, updateSession, 'value');
  }

  if (question.partLabels) {
    question.partA.partLabel = question.partLabelType === 'Letters' ? 'Part A' : 'Part 1';
    question.partB.partLabel = question.partLabelType === 'Letters' ? 'Part B' : 'Part 2';
  } else {
    question.partA.partLabel = undefined;
    question.partB.partLabel = undefined;
  }

  return new Promise(resolve => {
    resolve({
      disabled: env.mode !== 'gather',
      mode: env.mode,
      partLabels: question.partLabels,
      partLabelType: question.partLabelType,
      partA: parsePart(question.partA, 'partA', session, env),
      partB: parsePart(question.partB, 'partB', session, env)    });
  });
}

export const createDefaultModel = (model = {}) =>
  new Promise(resolve => {
    resolve({
      ...defaults,
      ...model
    });
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
    const { choices } = (config && config[key]) || {};
    const choicesLength = choices && choices.length;
    const scoreString = choicesLength ? (correctCount / choicesLength).toFixed(2) : 0;

    score = parseFloat(scoreString);
  }

  return score;
};

export function outcome(config, session, env) {
  return new Promise((resolve, reject) => {
    const { value } = session || {};

    if (!session || !value) {
      resolve({ score: 0, scoreA: 0, scoreB: 0, empty: true });
    }

    if (value) {
      const { partA, partB } = value;

      const scoreA = getScore(config, partA, 'partA');
      const scoreB = scoreA ? getScore(config, partB, 'partB') : 0;

      const score = scoreA + scoreB;

      resolve({ score, scoreA, scoreB, max: 2 });
    }
  });
}

const returnPartCorrect = choices => {
  let answers = [];

  choices.forEach(i => {
    const { correct, value } = i;
    if (correct) {
      answers.push(value);
    }
  });
  return answers;
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { partA, partB } = question;

      const partACorrect = returnPartCorrect(partA.choices);
      const partBCorrect = returnPartCorrect(partB.choices);

      resolve({
        value: {
          partA: {
            id: 'partA',
            value: partACorrect
          },
          partB: {
            id: 'partB',
            value: partBCorrect
          }
        },
        id: '1'
      });
    }
  });
};
