import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import { partialScoring } from '@pie-lib/controller-utils';

import { isResponseCorrect } from './utils';

import defaults from './defaults';

const log = debug('pie-elements:hotspot:controller');

export const normalize = (question) => ({
  ...defaults,
  ...question,
});

export function model(question, session, env) {
  const normalizedQuestion = normalize(question);
  const {
    imageUrl,
    dimensions,
    hotspotColor,
    hoverOutlineColor,
    selectedHotspotColor,
    multipleCorrect,
    outlineColor,
    partialScoring,
    prompt,
    shapes,
    language,
    fontSizeFactor,
    autoplayAudioEnabled,
    completeAudioEnabled,
    customAudioButton,
  } = normalizedQuestion;
  const { rectangles, polygons, circles } = shapes || {};

  const shouldIncludeCorrectResponse = env.mode === 'evaluate' || (env.role === 'instructor' && env.mode === 'view');

  return new Promise((resolve) => {
    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      dimensions,
      imageUrl,
      outlineColor,
      hotspotColor,
      hoverOutlineColor,
      selectedHotspotColor,
      multipleCorrect,
      partialScoring,
      language,
      fontSizeFactor,
      autoplayAudioEnabled,
      completeAudioEnabled,
      customAudioButton,
      shapes: {
        ...shapes,
        // eslint-disable-next-line no-unused-vars
        rectangles: (rectangles || []).map(({ index, correct, ...rectProps }) =>
          shouldIncludeCorrectResponse ? { correct, ...rectProps } : { ...rectProps },
        ),
        // eslint-disable-next-line no-unused-vars
        polygons: (polygons || []).map(({ index, correct, ...polyProps }) =>
          shouldIncludeCorrectResponse ? { correct, ...polyProps } : { ...polyProps },
        ),
        // eslint-disable-next-line no-unused-vars
        circles: (circles || []).map(({ index, correct, ...circleProps }) =>
          shouldIncludeCorrectResponse ? { correct, ...circleProps } : { ...circleProps },
        ),
      },
      responseCorrect: env.mode === 'evaluate' ? isResponseCorrect(normalizedQuestion, session) : undefined,
      extraCSSRules: normalizedQuestion.extraCSSRules,
    };

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
        ? normalizedQuestion.teacherInstructions
        : null;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
    }

    out.prompt = normalizedQuestion.promptEnabled ? prompt : null;
    out.strokeWidth = normalizedQuestion.strokeWidth;

    resolve(out);
  });
}

export const createDefaultModel = (model = {}) =>
  new Promise((resolve) => {
    resolve({
      ...defaults,
      ...model,
    });
  });

const getScore = (config, session, env = {}) => {
  const { answers } = session || {};

  if (!config.shapes || (!config.shapes.rectangles && !config.shapes.polygons && !config.shapes.circles)) {
    return 0;
  }

  const { shapes: { rectangles = [], polygons = [], circles = [] } = {} } = config;
  const partialScoringEnabled = partialScoring.enabled(config, env);

  if (!partialScoringEnabled) {
    return isResponseCorrect(config, session) ? 1 : 0;
  }

  let correctAnswers = 0;
  let selectedChoices = 0;

  const choices = [...rectangles, ...polygons, ...circles];

  const correctChoices = choices.filter((choice) => choice.correct);

  choices.forEach((shape) => {
    const selected = answers && answers.filter((answer) => answer.id === shape.id)[0];
    const correctlySelected = shape.correct && selected;

    if (selected) {
      selectedChoices += 1;
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
  return new Promise((resolve) => {
    log('outcome...');

    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    if (session.answers) {
      const score = getScore(config, session, env);
      resolve({ score });
    } else {
      resolve({ score: 0, empty: true });
    }
  });
}

const returnShapesCorrect = (shapes) => {
  let answers = [];

  shapes.forEach((i) => {
    const { correct, id } = i;
    if (correct) {
      answers.push({ id });
    }
  });
  return answers;
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { shapes: { rectangles = [], circles = [], polygons = {} } = {} } = question;

      const rectangleCorrect = returnShapesCorrect(rectangles);
      const polygonsCorrect = returnShapesCorrect(polygons);
      const circlesCorrect = returnShapesCorrect(circles);

      resolve({
        answers: [...rectangleCorrect, ...polygonsCorrect, ...circlesCorrect],
        id: '1',
      });
    } else {
      resolve(null);
    }
  });
};

// remove all html tags
const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

// remove all html tags except img, iframe and source tag for audio
const getContent = (html) => (html || '').replace(/(<(?!img|iframe|source)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const { shapes } = model;
  const { minShapes = 2, maxShapes, maxSelections } = config;
  const errors = {};

  ['teacherInstructions', 'prompt', 'rationale'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  const allShapes = Object.values(shapes || {}).reduce((acc, shape) => [...acc, ...shape], []);

  const nbOfSelections = (allShapes || []).reduce((acc, shape) => (shape.correct ? acc + 1 : acc), 0);

  const nbOfShapes = (allShapes || []).length;

  if (nbOfShapes < minShapes) {
    errors.shapes = `There should be at least ${minShapes} shapes defined.`;
  } else if (nbOfShapes > maxShapes) {
    errors.shapes = `No more than ${maxShapes} shapes should be defined.`;
  }

  if (nbOfSelections < 1) {
    errors.selections = 'There should be at least 1 shape selected.';
  } else if (nbOfSelections > maxSelections) {
    errors.selections = `No more than ${maxSelections} shapes should be selected.`;
  }

  return errors;
};
