import debug from 'debug';
import shuffle from 'lodash/shuffle';
import { isResponseCorrect } from './utils';

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

const normalize = (n, min, max) => Math.max(min, Math.min(max, n));

export const scoreFromRule = (rule, fallback) => {
  if (!rule || !Number.isFinite(rule.scorePercentage)) {
    return fallback;
  }
  return normalize(rule.scorePercentage, 0, 100) * 0.01;
};

export function outcome(config, session, env) {
  return new Promise((resolve, reject) => {
    log('outcome...');
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

    if (!config.partialScoring && correctCount < maxScore) {
      resolve({ score: 0 });
    } else {
      const scoreString = ( correctCount / config.choices.length ).toFixed(2);

      resolve( {score: parseFloat( scoreString ) });
    }
  });
}
