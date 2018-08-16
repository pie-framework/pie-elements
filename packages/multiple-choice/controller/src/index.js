import { isResponseCorrect } from './utils';
import debug from 'debug';
import compact from 'lodash/compact';

const log = debug('pie-elements:multiple-choice:controller');

const prepareChoice = (mode, defaultFeedback) => choice => {
  const out = {
    label: choice.label,
    value: choice.value
  };

  if (mode == 'evaluate') {
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
    const choices = question.choices.map(
      prepareChoice(env.mode, defaultFeedback)
    );

    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      prompt: question.prompt,
      choiceMode: question.choiceMode,
      keyMode: question.keyMode,
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

    const choices = compact(
      (session.value || []).map(v => config.choices.find(c => c.value === v))
    );
    const correct = choices.filter(isCorrect);
    const totalCorrect = config.choices.filter(isCorrect);
    const allCorrect = correct.length === totalCorrect.length;
    if (allCorrect) {
      resolve({
        score: 1
      });
    } else if (correct.length === 0) {
      resolve({ score: 0 });
    } else {
      if (config.partialScoring) {
        const rule = config.partialScoring.find(
          ps => ps.numberOfCorrect === correct.length
        );
        const score = scoreFromRule(rule, correct / totalCorrect);
        resolve({ score });
      } else {
        resolve({ score: 0 });
      }
    }
  });
}
