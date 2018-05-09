import debug from 'debug';
const log = debug('@pie-element:extended-text-entry:controller');

export function model(model, session, env) {
  log('[model]', model);

  const getFeedback = fb => {
    if (fb.type === 'none') {
      return;
    }

    if (fb.type === 'default' && fb.default) {
      return fb.default;
    }

    if (fb.type === 'custom' && fb.customFeedback) {
      return fb.customFeedback;
    }
    return 'Your work has been submitted';
  };

  return new Promise(resolve => {
    const out = {
      width: model.width,
      height: model.height,
      disabled: env.mode !== 'gather',
      feedback:
        env.mode === 'evaluate' ? getFeedback(model.feedback) : undefined
    };

    resolve(out);
  });
}
