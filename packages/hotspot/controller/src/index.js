import debug from 'debug';
import defaults from './defaults';
import { isResponseCorrect } from './utils';

const log = debug('pie-elements:hotspot:controller');

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

  return (correctAnswers / shapes.length).toFixed(2);
};

export function outcome(config, session) {
  return new Promise(resolve => {
    log('outcome...');
    const score = getScore(config, session);
    resolve({ score });
  });
}
