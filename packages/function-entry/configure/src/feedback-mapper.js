export const modelToFeedbackConfig = model => {

  const correctFeedback = model.correctResponse.feedback || {};
  const incorrectFeedback = model.incorrectFeedback || {};

  return {
    correctFeedback: correctFeedback.value,
    correctFeedbackType: correctFeedback.type || 'default',
    incorrectFeedback: incorrectFeedback.value,
    incorrectFeedbackType: incorrectFeedback.type || 'default',
  }
}

export const feedbackConfigToModel = (config, model) => {

  model.correctResponse = model.correctResponse || {};

  model.correctResponse.feedback = {
    type: config.correctFeedbackType,
    value: config.correctFeedback
  }

  model.incorrectFeedback = {
    type: config.incorrectFeedbackType,
    value: config.incorrectFeedback
  }
  return model;
}
