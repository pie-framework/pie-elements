import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import { partialScoring } from '@pie-lib/controller-utils';

import { isResponseCorrect } from './utils';

import defaults from './defaults';

const log = debug('pie-elements:hotspot:controller');

export const normalize = question => ({
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

export function model(question, session, env) {
  const normalizedQuestion = normalize(question);
  const {
    imageUrl,
    dimensions,
    hotspotColor,
    multipleCorrect,
    outlineColor,
    partialScoring,
    prompt,
    shapes
  } = normalizedQuestion;

  return new Promise(resolve => {
    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      dimensions,
      imageUrl,
      outlineColor,
      hotspotColor,
      multipleCorrect,
      partialScoring,
      shapes,
      responseCorrect:
        env.mode === 'evaluate'
          ? isResponseCorrect(normalizedQuestion, session)
          : undefined
    };

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled ? normalizedQuestion.teacherInstructions : null;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
    }

    out.prompt = normalizedQuestion.promptEnabled ? prompt : null;

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

const getScore = (config, session, env) => {
  const { answers } = session || {};
  const { shapes: { rectangles, polygons } } = config;
  const partialScoringEnabled = partialScoring.enabled(config, env);

  if (!partialScoringEnabled) {
    return isResponseCorrect(config, session) ? 1 : 0;
  }

  let correctAnswers = 0;

  const choices = [...rectangles, ...polygons];
  choices.forEach(shape => {
    const selected = answers && answers.filter(answer => answer.id === shape.id)[0];
    const correctlySelected = shape.correct && selected;
    const correctlyUnselected = !shape.correct && !selected;

    if (correctlySelected || correctlyUnselected) {
      correctAnswers += 1;
    }
  });

  const str = (correctAnswers / choices.length).toFixed(2);
  return parseFloat(str);
};

export function outcome(config, session, env) {
  return new Promise(resolve => {
    log('outcome...');

    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    if (session.answers) {
      const score = getScore(config, session, env);
      resolve({ score });
    }
  });
}

const returnShapesCorrect = (shapes) => {
  let answers = [];

  shapes.forEach(i => {
    const { correct, id } = i;
    if (correct) {
      answers.push({ id });
    }
  });
  return answers;
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { shapes: { rectangles, polygons } } = question;

      const rectangleCorrect = returnShapesCorrect(rectangles);
      const polygonsCorrect = returnShapesCorrect(polygons);

      resolve({
        answers: [
          ...rectangleCorrect,
          ...polygonsCorrect
        ],
        id: '1'
      });
    }
  });
};
