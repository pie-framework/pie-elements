import debug from 'debug';
import defaults from './defaults';

const log = debug('pie-elements:drawing-response:controller');

export const normalize = question => ({
  promptEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  backgroundImageEnabled: true,
  ...question,
});

export function model(question, session, env) {
  const normalizedQuestion = normalize(question);
  const {
    imageUrl,
    imageDimensions,
    prompt,
    promptEnabled,
    backgroundImageEnabled
  } = normalizedQuestion;

  return new Promise(resolve => {
    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      imageDimensions,
      imageUrl,
      prompt: promptEnabled ? prompt : null,
      backgroundImageEnabled
    };

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled ? normalizedQuestion.teacherInstructions : null;
    } else {
      out.teacherInstructions = null;
    }

    resolve(out);
  });
}

export const createDefaultModel = (model = {}) =>
  new Promise(resolve => {
    resolve({
      ...defaults,
      ...model,
    })
  });

export function outcome(/*config, session*/) {
  return new Promise(resolve => {
    log('outcome...');
    resolve({
      score: 0,
      completed: 'n/a',
      note: 'Requires manual scoring'
    });
  });
}
