import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';

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

export const outcome = (question, session, env) => {
  return new Promise((resolve, reject) => {
    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      const totalCorrect = question.tokens.filter(t => t.correct);
      const correctness = getCorrectness(
        question.tokens,
        session.selectedTokens
      );

      const getPartialScore = () => {
        const count = getCorrectCount(question.tokens, session.selectedTokens);

        return parseFloat((count / totalCorrect.length).toFixed(2));
      };
      const out = {
        score:
          correctness === 'correct'
            ? 1
            : correctness === 'partially-correct' && question.partialScoring
            ? getPartialScore()
            : 0,
        completed:
          Array.isArray(session.selectedTokens) &&
          session.selectedTokens.length > 0
      };
      resolve(out);
    }
  });
};

export function createConfigModel(model = {}) {
  return new Promise(resolve => {
    const tokens = () => [
      {
        text: 'Rachel cut out 8 stars in 6 minutes.',
        start: 0,
        end: 36,
      },
      {
        text: 'Lovelle cut out 6 stars in 4 minutes.',
        start: 37,
        end: 74,
      },
      {
        text: 'Lovelle and Rachel cut the same number of stars in 6 minutes.',
        start: 117,
        end: 177
      }
    ];

    const sensibleDefaults = {
      highlightChoices: true,
      maxSelections: 2,
      prompt: 'What sentences contain the character 6 in them?',
      text:
        'Rachel cut out 8 stars in 6 minutes. Lovelle cut out 6 stars in 4 minutes. Rachel cut out 4 more stars than Lovelle. Lovelle and Rachel cut the same number of stars in 6 minutes.',
      tokens: tokens(),
    };

    resolve({
      ...sensibleDefaults,
      ...model
    });
  });
}

export const model = (question, session, env) => {
  return new Promise((resolve, reject) => {
    log('[model]', 'question: ', question);
    log('[model]', 'session: ', session);
    const tokens = buildTokens(question.tokens, env.mode === 'evaluate');
    log('tokens:', tokens);
    const correctness =
      env.mode === 'evaluate'
        ? getCorrectness(question.tokens, session.selectedTokens)
        : undefined;

    const fb =
      env.mode === 'evaluate'
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

      resolve(out);
    });
  });
};
