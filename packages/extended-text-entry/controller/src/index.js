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
  console.log('session', session);
  console.log('question', question);
  console.log('env', env);
  const normalizedQuestion = normalize(question);
  console.log('normalizedQuestion', normalizedQuestion);

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

  let equationEditor = normalizedQuestion.equationEditor || 'miscellaneous';

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

  const annotatorMode = env.role === 'instructor' || env.mode === 'evaluate';
  const disabledAnnotator = env.role !== 'instructor';

  return fb.then(feedback => ({
    prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
    dimensions: normalizedQuestion.dimensions,
    customKeys: normalizedQuestion.customKeys || [],
    id: normalizedQuestion.id,
    disabled: env.mode !== 'gather',
    feedback,
    teacherInstructions,
    mathInput: normalizedQuestion.mathInput,
    equationEditor,
    annotatorMode,
    disabledAnnotator,
    predefinedAnnotations: normalizedQuestion.predefinedAnnotations
  }));
}

export async function outcome(/*question, session, env*/) {
  return {
    score: 0,
    completed: 'n/a',
    note: 'Requires manual scoring'
  };
}
