import debug from 'debug';
const log = debug('@pie-element:extended-text-entry:controller');
import { getFeedback } from '@pie-lib/feedback';

export async function model(model, session, env) {
  log('[model]', model);

  const fb =
    env.mode === 'evaluate'
      ? getFeedback(model.feedback, 'Your answer has been submitted')
      : Promise.resolve(undefined);
  return fb.then(feedback => ({
    width: model.width,
    height: model.height,
    disabled: env.mode !== 'gather',
    feedback
  }));
}

export async function outcome(question, session, env) {
  return {
    score: 0,
    completed: 'n/a',
    note: 'Requires manual scoring'
  };
}
