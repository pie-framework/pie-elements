import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { partialScoring } from '@pie-lib/controller-utils';
import defaults from './defaults';

const log = debug('@pie-element:select-text:controller');

const buildTokens = (tokens, evaluateMode) => {
  tokens = tokens || [];

  return tokens.map((t) =>
    Object.assign(
      {},
      t,
      evaluateMode ? { correct: !!t.correct } : { correct: undefined }
    )
  );
};

export const getCorrectness = (tokens, selected) => {
  const correct = tokens.filter((t) => t.correct === true);

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
  return (selected || []).filter((s) => {
    const index = tokens.findIndex((c) => {
      return c.correct &&
        (
          (c.start === s.start && c.end === s.end) ||
          // this case is used for the cases when the token's start & end were recalculated
          (c.start === s.oldStart && c.end === s.oldEnd)
        );
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
  const correctTokens = (question.tokens || []).filter((t) => t.correct === true);
  const extraSelected = session.selectedTokens ? session.selectedTokens.length > correctTokens.length : 0;
  const incorrectCount = extraSelected ? session.selectedTokens && session.selectedTokens.length - correctCount : 0;
  const count = correctCount - incorrectCount;
  const positiveCount = count < 0 ? 0 : count;

  return totalCorrect.length
    ? parseFloat((positiveCount / totalCorrect.length).toFixed(2))
    : 0;
};

export const outcome = (question, session, env) =>
  new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    session = normalizeSession(session);

    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      const enabled = partialScoring.enabled(question, env, true);
      const totalCorrect = question.tokens.filter((t) => t.correct);
      const score = getPartialScore(question, session, totalCorrect);
      resolve({
        score: enabled ? score : score === 1 ? 1 : 0,
      });
    }
  });

export function createDefaultModel(model = {}) {
  return new Promise((resolve) => {
    resolve({
      ...defaults,
      ...model,
    });
  });
}

export const normalizeSession = (s) => ({
  selectedTokens: [],
  ...s,
});

export const normalize = (question) => ({
  feedbackEnabled: true,
  rationaleEnabled: true,
  promptEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

export const model = (question, session, env) => {
  session = session || { selectedToken: [] };
  session.selectedTokens = session.selectedTokens || [];
  const normalizedQuestion = normalize(question);

  return new Promise((resolve) => {
    log('[model]', 'normalizedQuestion: ', normalizedQuestion);
    log('[model]', 'session: ', session);
    const tokens = buildTokens(
      normalizedQuestion.tokens,
      env.mode === 'evaluate'
    );
    log('tokens:', tokens);
    const correctness =
      env.mode === 'evaluate'
        ? getCorrectness(normalizedQuestion.tokens, session.selectedTokens)
        : undefined;

    const fb =
      env.mode === 'evaluate' && normalizedQuestion.feedbackEnabled
        ? getFeedbackForCorrectness(correctness, normalizedQuestion.feedback)
        : Promise.resolve(undefined);

    fb.then((feedback) => {
      const out = {
        tokens,
        highlightChoices: normalizedQuestion.highlightChoices,
        prompt: normalizedQuestion.promptEnabled
          ? normalizedQuestion.prompt
          : null,
        text: normalizedQuestion.text,
        disabled: env.mode !== 'gather',
        maxSelections: normalizedQuestion.maxSelections,
        correctness,
        feedback,
        incorrect:
          env.mode === 'evaluate' ? correctness !== 'correct' : undefined,
      };

      if (
        env.role === 'instructor' &&
        (env.mode === 'view' || env.mode === 'evaluate')
      ) {
        out.rationale = normalizedQuestion.rationaleEnabled
          ? normalizedQuestion.rationale
          : null;
        out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
          ? normalizedQuestion.teacherInstructions
          : null;
      } else {
        out.rationale = null;
        out.teacherInstructions = null;
      }

      resolve(out);
    });
  });
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { tokens } = question;
      const selectedTokens = tokens.filter((t) => t.correct);

      resolve({
        id: '1',
        selectedTokens,
      });
    } else {
      resolve(null);
    }
  });
};

export const validate = (model = {}, config = {}) => {
  const { tokens } = model;
  const { minTokens = 2, maxTokens, maxSelections } = config;
  const errors = {};
  const nbOfTokens = (tokens || []).length;

  const nbOfSelections = (tokens || []).reduce((acc, token) => token.correct ? acc + 1 : acc, 0);

  if (nbOfTokens < minTokens) {
    errors.nbOfTokens = `Should be defined at least ${minTokens} tokens.`;
  } else if (nbOfTokens > maxTokens) {
    errors.nbOfTokens = `No more than ${maxTokens} tokens should be defined.`;
  }

  if (nbOfSelections < 1) {
    errors.nbOfSelections = `Should be selected at least 1 token.`;
  } else if (nbOfSelections > maxSelections) {
    errors.nbOfSelections = `No more than ${maxSelections} tokens should be selected.`;
  }

  return errors;
};
