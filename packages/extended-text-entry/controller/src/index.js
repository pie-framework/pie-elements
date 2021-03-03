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

export const normalize = question => ({
  ...defaults,
  feedbackEnabled: true,
  rationaleEnabled: true,
  promptEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});


export async function model(question, session, env) {
  log('[question]', question);
  const normalizedQuestion = normalize(question);

  const fb =
    env.mode === 'evaluate' && normalizedQuestion.feedbackEnabled
      ? getFeedback(normalizedQuestion.feedback, 'Your answer has been submitted')
      : Promise.resolve(undefined);

  let teacherInstructions = null;
  if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
    teacherInstructions = normalizedQuestion.teacherInstructionsEnabled ? normalizedQuestion.teacherInstructions : null;
  } else {
    teacherInstructions = null;
  }

  let equationEditor = normalizedQuestion.equationEditor || 'everything';

  switch (normalizedQuestion.equationEditor) {
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
    prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
    dimensions: normalizedQuestion.dimensions,
    disabled: env.mode !== 'gather',
    feedback,
    teacherInstructions,
    mathInput: normalizedQuestion.mathInput,
    equationEditor
  }));
}

export async function outcome(/*question, session, env*/) {
  return {
    score: 0,
    completed: 'n/a',
    note: 'Requires manual scoring'
  };
}
