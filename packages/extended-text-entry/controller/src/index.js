import debug from 'debug';
const log = debug('@pie-element:extended-text-entry:controller');
import { getFeedback } from '@pie-lib/feedback';

import defaults from './defaults';

export async function createDefaultModel(model = {}) {
  log('[createDefaultModel]', model);

  return {
    ...defaults,
    ...model,
  };
}

export async function model(model, session, env) {
  log('[model]', model);

  const fb =
    env.mode === 'evaluate'
      ? getFeedback(model.feedback, 'Your answer has been submitted')
      : Promise.resolve(undefined);

  let teacherInstructions = null;

  if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
    teacherInstructions = model.teacherInstructions;
  }

  return fb.then(feedback => ({
    prompt: model.prompt,
    width: model.width,
    height: model.height,
    disabled: env.mode !== 'gather',
    feedback,
    teacherInstructions
  }));
}

export async function outcome(question, session, env) {
  return {
    score: 0,
    completed: 'n/a',
    note: 'Requires manual scoring'
  };
}
