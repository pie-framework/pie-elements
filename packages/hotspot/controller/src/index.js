import debug from 'debug';
import isEqual from 'lodash/isEqual';
import defaults from './defaults';

const log = debug('pie-elements:hotspot:controller');

const getCorrectResponse = (choices) => choices
  .filter(c => c.correct)
  .map(c => ({ id: c.id }))
  .sort();

const isResponseCorrect = (question, session) => {
  let correctResponse = getCorrectResponse(question.shapes);

  if (session.answers.length) {
    return isEqual((session.answers || []).sort(), correctResponse);
  }
  return false;
};


export function model(question, session, env) {
  const {
    imageUrl,
    dimensions,
    hotspotColor,
    maxImageHeight,
    maxImageWidth,
    multipleCorrect,
    outlineColor,
    prompt,
    shapes
  } = question;

  return new Promise(resolve => {
    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      dimensions,
      imageUrl,
      outlineColor,
      hotspotColor,
      maxImageHeight,
      maxImageWidth,
      multipleCorrect,
      prompt,
      shapes,
      responseCorrect:
        env.mode === 'evaluate'
          ? isResponseCorrect(question, session)
          : undefined
    };

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.rationale = question.rationale;
    } else {
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

const getScore = (config, session) => {
  const { answers } = session;
  const { partialScoring, shapes } = config;

  if (!partialScoring) {
    return isResponseCorrect(config, session) ? 1 : 0;
  }

  let correctAnswers = 0;

  shapes.forEach(shape => {
    const selected = answers.filter(answer => answer.id === shape.id)[0];
    const correctlySelected = shape.correct && selected;
    const correctlyUnselected = !shape.correct && !selected;

    if (correctlySelected || correctlyUnselected) {
      correctAnswers += 1;
    }
  });

  const str = (correctAnswers / shapes.length).toFixed(2);
  return parseFloat(str);
};

export function outcome(config, session) {
  return new Promise(resolve => {
    log('outcome...');

    if (session.answers) {
      const score = getScore(config, session);
      resolve({ score });
    }
  });
}
