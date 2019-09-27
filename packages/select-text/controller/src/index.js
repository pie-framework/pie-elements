import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
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

export const getPartialScore = (question, session, totalCorrect) => {
  if (!session || isEmpty(session)) {
    return 0;
  }

  const correctCount = getCorrectCount(question.tokens, session.selectedTokens);
  const incorrectCount = session.selectedTokens.length - correctCount;
  const count = correctCount - incorrectCount;
  const positiveCount = count < 0 ? 0 : count;

  return totalCorrect.length
    ? parseFloat((positiveCount / totalCorrect.length).toFixed(2))
    : 0;
};

export const outcome = (question, session, env) =>
  new Promise(resolve => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

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
  session = session || { selectedToken: [] };
  session.selectedTokens = session.selectedTokens || [];
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
        prompt: question.promptEnabled ? question.prompt : null,
        text: question.text,
        disabled: env.mode !== 'gather',
        maxSelections: question.maxSelections,
        correctness,
        feedback,
        incorrect:
          env.mode === 'evaluate' ? correctness !== 'correct' : undefined
      };

      if (
        env.role === 'instructor' &&
        (env.mode === 'view' || env.mode === 'evaluate')
      ) {
        out.rationale = question.rationaleEnabled ? question.rationale : null;
        out.teacherInstructions = question.teacherInstructionsEnabled ? question.teacherInstructions : null;
      } else {
        out.rationale = null;
        out.teacherInstructions = null;
      }

      resolve(out);
    });
  });
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { tokens } = question;
      const selectedTokens = tokens.filter(t => t.correct);

      resolve({
        id: '1',
        selectedTokens
      });
    }
  });
};
