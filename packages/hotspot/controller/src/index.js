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
  strokeWidth: 5,
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
  const { rectangles, polygons } = shapes || {};

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
      shapes: {
        ...shapes,
        // eslint-disable-next-line no-unused-vars
        rectangles: (rectangles || []).map(({ index, ...rectProps }) => ({ ...rectProps })),
        // eslint-disable-next-line no-unused-vars
        polygons: (polygons || []).map(({ index, ...polyProps }) => ({ ...polyProps }))
      },
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
    out.strokeWidth = normalizedQuestion.strokeWidth;

    // console.log(out);
    resolve(out);
  });
}

export const createDefaultModel = (model = {}) =>
  new Promise(resolve => {
    resolve({
      ...defaults,
      ...model,
    });
  });

const getScore = (config, session, env = {}) => {
  const { answers } = session || {};

  if (!config.shapes || (!config.shapes.rectangles && !config.shapes.polygons)) {
    return 0;
  }

  const { shapes: { rectangles = [], polygons = [] } = {} } = config;
  const partialScoringEnabled = partialScoring.enabled(config, env);

  if (!partialScoringEnabled) {
    return isResponseCorrect(config, session) ? 1 : 0;
  }

  let correctAnswers = 0;
  let selectedChoices = 0;

  const choices = [...rectangles, ...polygons];

  const correctChoices = choices.filter(choice => choice.correct);

  choices.forEach(shape => {
    const selected = answers && answers.filter(answer => answer.id === shape.id)[0];
    const correctlySelected = shape.correct && selected;

    if(selected) {
      selectedChoices +=1;
    }

    if (correctlySelected) {
      correctAnswers += 1;
    }
  });

  const extraAnswers = selectedChoices > correctChoices.length ? selectedChoices - correctChoices.length : 0;

  const total = correctChoices.length === 0 ? 1 : correctChoices.length;
  const str = ((correctAnswers - extraAnswers) / total).toFixed(2);

  return str < 0 ? 0 : parseFloat(str);
};

export function outcome(config, session, env = {}) {
  return new Promise(resolve => {
    log('outcome...');

    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    if (session.answers) {
      const score = getScore(config, session, env);
      resolve({ score });
    } else {
      resolve({score: 0, empty: true})
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
      const { shapes: { rectangles = [], polygons = {} } = {} } = question;

      const rectangleCorrect = returnShapesCorrect(rectangles);
      const polygonsCorrect = returnShapesCorrect(polygons);

      resolve({
        answers: [
          ...rectangleCorrect,
          ...polygonsCorrect
        ],
        id: '1'
      });
    } else {
      resolve(null);
    }
  });
};
