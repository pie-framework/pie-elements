import debug from 'debug';
const log = debug('@pie-element:extended-text-entry:controller');

export function model(model, session, env) {
  log('[model]', model);

  const getFeedback = fb => {
    if (fb.feedbackType === 'default' && !fb.feedback) {
      return `Your work has been submitted`;
    }
    return fb.feedback;
  };

  model.feedback.feedbackType === 'default';
  return new Promise(resolve => {
    const { config } = model.model;

    const width = `${config.expectedLength * 4}px`;
    const height = `${config.expectedLines * 20}px`;
    const out = {
      width,
      height,
      disabled: env.mode !== 'gather',
      feedback:
        env.mode === 'evaluate' ? getFeedback(model.feedback) : undefined
    };

    resolve(out);
  });
}
