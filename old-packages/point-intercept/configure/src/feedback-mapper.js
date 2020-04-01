export const modelToFeedbackConfig = model => {

  const feedback = model.feedback || {};

  return {
    correctFeedback: feedback.correctFeedbackValue,
    correctFeedbackType: feedback.correctFeedbackType || 'none',
    incorrectFeedback: feedback.incorrectFeedbackValue,
    incorrectFeedbackType: feedback.incorrectFeedbackType || 'none',
    partialFeedback: feedback.partialFeedbackValue,
    partialFeedbackType: feedback.partialFeedbackType || 'none',
  }
};

export const feedbackConfigToModel = (config, model) => {
  const feedback = model.feedback;

  feedback.correctFeedbackValue = config.correctFeedback;
  feedback.correctFeedbackType = config.correctFeedbackType;
  feedback.incorrectFeedbackValue = config.incorrectFeedback;
  feedback.incorrectFeedbackType = config.incorrectFeedbackType;
  feedback.partialFeedbackValue = config.partialFeedback;
  feedback.partialFeedbackType = config.partialFeedbackType;

  return model;
};
