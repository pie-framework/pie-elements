import debug from 'debug';

import cloneDeep from 'lodash/cloneDeep';
import uniqWith from 'lodash/uniqWith';
import isEmpty from 'lodash/isEmpty';
import defaults from './defaults';
import { equalMarks, sortedAnswers, removeInvalidAnswers } from './utils';

import { partialScoring } from '@pie-lib/pie-toolbox/controller-utils';

const log = debug('@pie-element:graphing:controller');

const initializeGraphMap = () => ({
  point: [],
  segment: [],
  line: [],
  ray: [],
  vector: [],
  polygon: [],
  circle: [],
  sine: [],
  parabola: [],
  absolute: [],
  exponential: [],
});

const graphObjectsOrder = {
  incorrect: 0,
  correct: 1,
  missing: 2,
};

export const compareMarks = (mark1, mark2) => {
  // marks can be compared with equalMarks[type] function only if they have the same type;
  // if type is different, they are clearly not equal
  return !!(
    mark1 &&
    mark2 &&
    mark1.type === mark2.type &&
    equalMarks[mark1.type] &&
    equalMarks[mark1.type](mark1, mark2)
  );
};

export const comparLabelMarks = (mark1, mark2) => {
  return mark1.label === mark2.label ? 'correct' : 'incorrect';
};

export const getAnswerCorrected = ({ sessionAnswers, marks: correctAnswers }) => {
  sessionAnswers = sessionAnswers || [];
  correctAnswers = correctAnswers || [];

  const rez = cloneDeep(sessionAnswers).reduce((correctedAnswer, answer) => {
    const answerIsCorrect = correctAnswers.find((mark) => compareMarks(answer, mark));

    answer.correctness = answerIsCorrect ? 'correct' : 'incorrect';
    if (answerIsCorrect) {
      answer.correctnesslabel = comparLabelMarks(answer, answerIsCorrect);
      answer.correctlabel = answerIsCorrect.label ? answerIsCorrect.label : '';
      answer.label = answer.label ? answer.label : '';
    }
    return [...correctedAnswer, answer];
  }, []);

  // add missing objects from correct answer
  const missingAnswers = cloneDeep(correctAnswers).reduce((correctedAnswer, answer) => {
    const answerIndex = sessionAnswers.find((mark) => compareMarks(answer, mark));

    if (!answerIndex) {
      // means that corrected answer is missing from session, so we mark it as missing object
      return [...correctedAnswer, { ...answer, correctness: 'missing' }];
    }

    return correctedAnswer;
  }, []);

  return [...rez, ...missingAnswers];
};

const getPartialScoring = ({ scoringType, env }) => {
  let pS = scoringType;

  // if scoringType is undefined, partialScoring should be considered undefined (not set)
  // because partialScoring.enabled is using that information
  // if it has a value, we check if it is partial scoring or dichotomous
  if (scoringType) {
    pS = scoringType === 'partial scoring';
  }

  return partialScoring.enabled({ partialScoring: pS }, env);
};

export const getBestAnswer = (question, session, env = {}) => {
  // questionPossibleAnswers contains all possible answers (correct response and alternates);
  let { answers: questionPossibleAnswers = {}, scoringType } = question || {};
  let { answer } = session || {};

  // filter the incomplete objects
  Object.entries(questionPossibleAnswers || {}).forEach(
    ([key, value]) =>
      (questionPossibleAnswers[key] = { ...value, marks: value?.marks.filter((mark) => !mark.building) }),
  );

  // initialize answer if no values
  answer = answer || [];

  // initialize one possible answer if no values
  if (isEmpty(questionPossibleAnswers)) {
    questionPossibleAnswers = { correctAnswer: initializeGraphMap() };
  } else {
    questionPossibleAnswers = {
      correctAnswer: questionPossibleAnswers.correctAnswer,
      ...sortedAnswers(questionPossibleAnswers),
    };
  }

  const partialScoringEnabled = getPartialScoring({ scoringType, env });

  // student's answers without DUPLICATES
  const sessionAnswers = uniqWith(answer, compareMarks);
  // array of possible answers entries
  const possibleAnswers = Object.entries(questionPossibleAnswers);

  return possibleAnswers.reduce(
    (acc, entry) => {
      // iterating each possible answer (main + alternates)
      const possibleAnswerKey = entry[0];
      const possibleAnswer = entry[1] || {};
      let { marks } = possibleAnswer;

      if (!marks || !marks.length) {
        return acc;
      }

      // returns array of marks, each having 'correctness' property
      const correctedAnswer = getAnswerCorrected({ sessionAnswers, marks });
      const correctMarks = correctedAnswer.filter((answer) => answer.correctness === 'correct');
      // filter out missing objects because they do not affect the calculation of the score
      // only correct and incorrect are needed
      const scoredCorrectedAnswer = correctedAnswer.filter((answer) => answer.correctness !== 'missing');

      const maxScore = marks.length;
      let score = correctMarks.length;

      // if extra placements
      if (scoredCorrectedAnswer.length > maxScore) {
        score -= scoredCorrectedAnswer.length - maxScore;
      }

      if (score < 0) {
        score = 0;
      }

      if (score / maxScore > acc.bestScore || !acc.foundOneSolution) {
        if (partialScoringEnabled) {
          acc.bestScore = parseFloat((score / maxScore).toFixed(2));
        } else {
          acc.bestScore = Math.floor(score / maxScore);
        }

        acc.bestScoreAnswerKey = possibleAnswerKey;
        acc.answersCorrected = correctedAnswer;
        acc.foundOneSolution = true;
      }

      return acc;
    },
    {
      bestScore: 0,
      bestScoreAnswerKey: null,
      // initially we just suppose all the answers are incorrect
      answersCorrected: cloneDeep(sessionAnswers).map((answer) => ({ ...answer, correctness: 'incorrect' })),
      foundOneSolution: false,
    },
  );
};

export const normalize = (question) => ({ ...defaults, ...question });

export function model(question, session, env) {
  return new Promise((resolve) => {
    const normalizedQuestion = normalize(question);

    // added a sanity check for session for environments where it is not passed initially (ex. pie-website)
    if (session === undefined || session === null) {
      session = {};
    }
    // ensure removing of invalid answers
    // need this if undo redo was last operation
    session.answer = removeInvalidAnswers(session.answer);
    // console.log('normalizedQuestion', normalizedQuestion);
    const { defaultTool, prompt, promptEnabled, graph, answers, toolbarTools, ...questionProps } =
      normalizedQuestion || {};
    let { arrows } = normalizedQuestion;
    const { mode, role } = env || {};

    // This is used for offering support for old models which have the property arrows: boolean
    // Same thing is set in authoring : packages/graphing/configure/src/configure.jsx - componentDidMount
    if (typeof arrows === 'boolean') {
      if (arrows) {
        arrows = {
          left: true,
          right: true,
          up: true,
          down: true,
        };
      } else {
        arrows = {
          left: false,
          right: false,
          up: false,
          down: false,
        };
      }
    }

    // added support for models without defaultTool defined; also used in packages/graphing/configure/src/index.js
    const toolbarToolsNoLabel = (toolbarTools || []).filter((tool) => tool !== 'label');
    const normalizedDefaultTool = defaultTool || (toolbarToolsNoLabel.length && toolbarToolsNoLabel[0]) || '';

    const base = {
      ...questionProps,
      answers,
      arrows,
      defaultTool: normalizedDefaultTool,
      disabled: env.mode !== 'gather',
      prompt: promptEnabled ? prompt : null,
      rationale: null,
      size: graph,
      showKeyLegend: env.mode === 'evaluate',
      showToggle:
        env.mode === 'evaluate' &&
        !isEmpty(answers) &&
        answers.correctAnswer &&
        answers.correctAnswer.marks &&
        !isEmpty(answers.correctAnswer.marks),
      teacherInstructions: null,
      toolbarTools,
    };

    if (role === 'instructor' && (mode === 'view' || mode === 'evaluate')) {
      const { rationale, rationaleEnabled, teacherInstructions, teacherInstructionsEnabled } = normalizedQuestion || {};

      base.rationale = rationaleEnabled ? rationale : null;
      base.teacherInstructions = teacherInstructionsEnabled ? teacherInstructions : null;
    }

    if (mode === 'evaluate') {
      if (
        !isEmpty(answers) &&
        answers.correctAnswer &&
        answers.correctAnswer.marks &&
        !isEmpty(answers.correctAnswer.marks)
      ) {
        const { answersCorrected, bestScoreAnswerKey, bestScore } = getBestAnswer(normalizedQuestion, session, env);
        // array of marks from session with 'correctness' property set
        base.answersCorrected = answersCorrected.sort(
          (a, b) => graphObjectsOrder[a.correctness] - graphObjectsOrder[b.correctness],
        );
        base.correctResponse = bestScoreAnswerKey ? (answers[bestScoreAnswerKey] || {}).marks : [];
        base.showToggle = base.showToggle && bestScore !== 1;
      } else {
        base.answersCorrected = (session && session.answer) || [];
        base.correctResponse = [];
      }
    }

    log('base: ', base);
    resolve(base);
  });
}

export function outcome(question, session, env = {}) {
  return new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    if (
      env.mode !== 'evaluate' ||
      isEmpty(question.answers) ||
      (question.answers && question.answers.correctAnswer && isEmpty(question.answers.correctAnswer.marks))
    ) {
      resolve({ score: 0 });
    }

    const { bestScore } = getBestAnswer(question, session, env);

    resolve({ score: bestScore });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { answers } = question || {};
      let marks = [];

      if (answers && Object.values(answers)) {
        const correctAnswer = answers.correctAnswer || Object.values(answers)[0] || {};
        marks = correctAnswer.marks || [];
      }

      resolve({
        answer: marks,
        id: '1',
      });
    } else {
      resolve(null);
    }
  });
};

// remove all html tags
const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

// remove all html tags except img and iframe
const getContent = (html) => (html || '').replace(/(<(?!img|iframe)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const { answers, toolbarTools } = model;
  const errors = {};
  const correctAnswerErrors = {};
  const toolbarToolsNoLabel = (toolbarTools || []).filter((tool) => tool !== 'label');

  if (!toolbarToolsNoLabel.length) {
    errors.toolbarToolsError = 'There should be at least 1 tool defined.';
  }

  ['teacherInstructions', 'prompt', 'rationale'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  Object.entries(answers || {}).forEach(([key, value]) => {
    if (!value.marks.length) {
      correctAnswerErrors[key] = 'At least 1 graph object should be defined.';
    }

    // check if all graph objects are correctly defined with respect to root, edge and from, to
    if (value.marks.length > 0) {
      value.marks.forEach((mark) => {
        if (mark.building) {
          correctAnswerErrors[key] = 'At least 1 graph object is not correctly defined.';
        }
      });
    }
  });

  if (!isEmpty(correctAnswerErrors)) {
    errors.correctAnswerErrors = correctAnswerErrors;
  }

  return errors;
};
