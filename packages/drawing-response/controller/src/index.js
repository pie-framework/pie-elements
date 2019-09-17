import debug from 'debug';
import defaults from './defaults';

const log = debug('pie-elements:drawing-response:controller');

export function model(question, session, env) {
  const {
    imageUrl,
    imageDimensions,
    prompt,
  } = question;

  return new Promise(resolve => {
    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      imageDimensions,
      imageUrl,
      prompt,
    };

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.teacherInstructions = question.teacherInstructionsEnabled ? question.teacherInstructions : null;
      out.rationale = question.rationaleEnabled ? question.rationale : null;
    } else {
      out.teacherInstructions = null;
      out.rationale = null;
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

export function outcome(config, session) {
  return new Promise(resolve => {
    log('outcome...');
    resolve({
      score: 0,
      completed: 'n/a',
      note: 'Requires manual scoring'
    });
  });
}
