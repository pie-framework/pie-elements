export const modelToFeedbackConfig = model => {
  const correctFeedback = model.correctResponses.feedback || {};
  const incorrectFeedback = model.incorrectFeedback || {};
  const partialFeedback = model.partialResponses.feedback || {};

  return {
    correctFeedback: correctFeedback.value,
    correctFeedbackType: correctFeedback.type || 'default',
    incorrectFeedback: incorrectFeedback.value,
    incorrectFeedbackType: incorrectFeedback.type || 'default',
    partialFeedback: partialFeedback.value,
    partialFeedbackType: partialFeedback.type || 'default'
  };
};

export const feedbackConfigToModel = (config, model) => {
  model.correctResponses = model.correctResponses || {};

  model.correctResponses.feedback = {
    type: config.correctFeedbackType,
    value: config.correctFeedback
  };

  model.partialResponses = model.partialResponses || {};
  model.partialResponses.feedback = {
    type: config.partialFeedbackType,
    value: config.partialFeedback
  };

  model.incorrectFeedback = {
    type: config.incorrectFeedbackType,
    value: config.incorrectFeedback
  };
  return model;
};
