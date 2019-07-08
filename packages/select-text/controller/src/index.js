import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { partialScoring } from '@pie-lib/controller-utils';
import defaults from './defaults';

const log = debug('@pie-element:select-text:controller');

const buildTokens = (tokens, evaluateMode) => {
  return tokens.map(t =>
    Object.assign(
      {},
      t,
      evaluateMode ? { correct: !!t.correct } : { correct: undefined }
    )
  );
};

export const getCorrectness = (tokens, selected) => {
  const correct = tokens.filter(t => t.correct === true);

  if (correct.length === 0) {
    return 'unknown';
  }

  const correctSelected = getCorrectSelected(tokens, selected);

  if (correctSelected.length === selected.length) {
    if (correctSelected.length === correct.length) {
      return 'correct';
    } else if (correctSelected.length > 0) {
      return 'partially-correct';
    }
  }

  if (correctSelected.length > 0) {
    return 'partially-correct';
  }

  return 'incorrect';
};

const getCorrectSelected = (tokens, selected) => {
  return selected.filter(s => {
    const index = tokens.findIndex(c => {
      return c.correct && c.start === s.start && c.end === s.end;
    });
    return index !== -1;
  });
};

const getCorrectCount = (tokens, selected) =>
  getCorrectSelected(tokens, selected).length;

const getPartialScore = (question, session, totalCorrect) => {
  const count = getCorrectCount(question.tokens, session.selectedTokens);
  return parseFloat((count / totalCorrect.length).toFixed(2));
};

export const outcome = (question, session, env) =>
  new Promise(resolve => {
    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      const enabled = partialScoring.enabled(question, env, true);
      const totalCorrect = question.tokens.filter(t => t.correct);
      const score = getPartialScore(question, session, totalCorrect);
      resolve({
        score: enabled ? score : score === 1 ? 1 : 0
      });
    }
  });

export function createDefaultModel(model = {}) {
  return new Promise(resolve => {
    resolve({
      ...defaults,
      ...model
    });
  });
}

export const model = (question, session, env) => {
  return new Promise(resolve => {
    log('[model]', 'question: ', question);
    log('[model]', 'session: ', session);
    const tokens = buildTokens(question.tokens, env.mode === 'evaluate');
    log('tokens:', tokens);
    const correctness =
      env.mode === 'evaluate'
        ? getCorrectness(question.tokens, session.selectedTokens)
        : undefined;

    const fb =
      env.mode === 'evaluate' && question.allowFeedback
        ? getFeedbackForCorrectness(correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const out = {
        tokens,
        highlightChoices: question.highlightChoices,
        prompt: question.prompt,
        text: question.text,
        disabled: env.mode !== 'gather',
        maxSelections: question.maxSelections,
        correctness,
        feedback,
        incorrect:
          env.mode === 'evaluate' ? correctness !== 'correct' : undefined
      };

      if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
        out.rationale = question.rationale;
        out.teacherInstructions = question.teacherInstructions;
      } else {
        out.rationale = null;
        out.teacherInstructions = null;
      }

      resolve(out);
    });
  });
};
