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

// const defaultFeedback = () => ({
//   correctFeedbackType: 'default',
//   correctFeedback: 'Correct',
//   incorrectFeedbackType: 'default',
//   incorrectFeedback: 'Incorrect',
//   partialFeedbackType: 'default',
//   partialFeedback: 'Nearly'
// });

// const getFeedbackText = (type, text, fallback) => {
//   if (type === 'none') {
//     return;
//   }
//   if (!text || text === '') {
//     return fallback;
//   }
//   return text;
// };

// export const getFeedback = (correctness, feedback) => {
//   feedback = Object.assign(defaultFeedback(), feedback);
//   log('feedback: ', feedback);

//   let fb = undefined;

//   if (correctness === 'correct') {
//     fb = getFeedbackText(
//       feedback.correctFeedbackType,
//       feedback.correctFeedback,
//       'Correct'
//     );
//   } else if (correctness === 'incorrect') {
//     fb = getFeedbackText(
//       feedback.incorrectFeedbackType,
//       feedback.incorrectFeedback,
//       'Incorrect'
//     );
//   } else if (correctness === 'partially-correct') {
//     fb = getFeedbackText(
//       feedback.partialFeedbackType,
//       feedback.partialFeedback,
//       'Nearly'
//     );
//   }

//   return fb;
// };

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
      return (
        c.correct && c.text === s.text && c.start === s.start && c.end === s.end
      );
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
      const correctness = getCorrectness(
        question.tokens,
        session.selectedTokens
      );

      const getPartialScore = () => {
        const count = getCorrectCount(question.tokens, session.selectedTokens);
        const rule = question.partialScoring.find(
          p => p.numberOfCorrect === count
        );
        if (rule) {
          return rule.scorePercentage / 100;
        } else {
          return 0;
        }
      };
      const out = {
        score:
          correctness === 'correct'
            ? 1
            : correctness === 'partially-correct' &&
              Array.isArray(question.partialScoring)
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
