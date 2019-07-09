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
    env.mode === 'evaluate' && model.allowFeedback
      ? getFeedback(model.feedback, 'Your answer has been submitted')
      : Promise.resolve(undefined);

  let teacherInstructions = null;

  if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
    teacherInstructions = model.teacherInstructions;
  }

  let equationEditor = model.equationEditor || 'everything';

  switch (model.equationEditor) {
    case 'Grade 1 - 2':
      equationEditor = 1;
      break;
    case 'Grade 3 - 5':
      equationEditor = 3;
      break;
    case 'Grade 6 - 7':
      equationEditor = 6;
      break;
    case 'Grade 8 - HS':
      equationEditor = 8;
      break;
    default:
      break;
  }

  return fb.then(feedback => ({
    prompt: model.prompt,
    dimensions: model.dimensions,
    disabled: env.mode !== 'gather',
    feedback,
    teacherInstructions,
    mathInput: model.mathInput,
    equationEditor
  }));
}

export async function outcome(question, session, env) {
  return {
    score: 0,
    completed: 'n/a',
    note: 'Requires manual scoring'
  };
}
