import debug from 'debug';

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

const defaultFeedback = () => ({
  correctFeedbackType: 'default',
  correctFeedback: 'Correct',
  incorrectFeedbackType: 'default',
  incorrectFeedback: 'Incorrect',
  partialFeedbackType: 'default',
  partialFeedback: 'Nearly'
});

const getFeedbackText = (type, text, fallback) => {
  if (type === 'none') {
    return;
  }
  if (!text || text === '') {
    return fallback;
  }
  return text;
};

export const getFeedback = (correctness, feedback) => {
  feedback = Object.assign(defaultFeedback(), feedback);
  log('feedback: ', feedback);

  let fb = undefined;

  if (correctness === 'correct') {
    fb = getFeedbackText(
      feedback.correctFeedbackType,
      feedback.correctFeedback,
      'Correct'
    );
  } else if (correctness === 'incorrect') {
    fb = getFeedbackText(
      feedback.incorrectFeedbackType,
      feedback.incorrectFeedback,
      'Incorrect'
    );
  } else if (correctness === 'partially-correct') {
    fb = getFeedbackText(
      feedback.partialFeedbackType,
      feedback.partialFeedback,
      'Nearly'
    );
  }

  return fb;
};

export const getCorrectness = (tokens, selected) => {
  const correct = tokens.filter(t => t.correct === true);

  if (correct.length === 0) {
    return 'unknown';
  }

  const correctSelected = selected.filter(s => {
    const index = correct.findIndex(c => {
      return c.text === s.text && c.start === s.start && c.end === s.end;
    });
    return index !== -1;
  });

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
    const out = {
      tokens,
      highlightChoices: question.highlightChoices,
      text: question.text,
      disabled: env.mode !== 'gather',
      maxSelections: question.maxSelections,
      correctness,
      feedback:
        env.mode === 'evaluate' && getFeedback(correctness, question.feedback),
      incorrect: env.mode === 'evaluate' && correctness !== 'correct'
    };

    log('out: ', out);
    resolve(out);
  });
};
