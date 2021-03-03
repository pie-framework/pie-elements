import debug from 'debug';

import cloneDeep from 'lodash/cloneDeep';
import uniqWith from 'lodash/uniqWith';
import isEmpty from 'lodash/isEmpty';
import defaults from './defaults';
import { equalMarks, sortedAnswers } from './utils';

import { partialScoring } from '@pie-lib/controller-utils';

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
  parabola: []
});

export const compareMarks = (mark1, mark2) => {
  // marks can be compared with equalMarks[type] function only if they have the same type;
  // if type is different, they are clearly not equal
  return !!(mark1 && mark2 && mark1.type === mark2.type && equalMarks[mark1.type] && equalMarks[mark1.type](mark1, mark2));
};

export const getAnswerCorrected = ({ sessionAnswers, marks: correctAnswers }) => {
  sessionAnswers = sessionAnswers || [];
  correctAnswers = correctAnswers || [];

  return cloneDeep(sessionAnswers).reduce((correctedAnswer, answer) => {
    const answerIsCorrect = correctAnswers.find(mark => compareMarks(answer, mark));

    answer.correctness = answerIsCorrect ? 'correct' : 'incorrect';

    return [...correctedAnswer, answer];
  }, []);
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

export const orderCorrectAnswers = (questionPossibleAnswers) => {
  questionPossibleAnswers = questionPossibleAnswers || {};

  if (!questionPossibleAnswers.hasOwnProperty('correctAnswer')) {
    sortedAnswers(questionPossibleAnswers);
  }

  return Object.assign({ correctAnswer: questionPossibleAnswers.correctAnswer }, sortedAnswers(questionPossibleAnswers));
};

export const getBestAnswer = (question, session, env = {}) => {
  // questionPossibleAnswers contains all possible answers (correct response and alternates);
  let { answers: questionPossibleAnswers, scoringType } = question || {};
  let { answer } = session || {};

  // initialize answer if no values
  answer = answer || [];

  // initialize one possible answer if no values
  if (isEmpty(questionPossibleAnswers)) {
    questionPossibleAnswers = { correctAnswer: initializeGraphMap() };
  } else {
    orderCorrectAnswers(questionPossibleAnswers);
  }

  const partialScoringEnabled = getPartialScoring({ scoringType, env });

  // student's answers without DUPLICATES
  const sessionAnswers = uniqWith(answer, compareMarks);
  // array of possible answers entries
  const possibleAnswers = Object.entries(questionPossibleAnswers);

  return possibleAnswers.reduce((acc, entry) => {
    // iterating each possible answer (main + alternates)
    const possibleAnswerKey = entry[0];
    const possibleAnswer = entry[1] || {};
    let { marks } = possibleAnswer;

    if (!marks || !marks.length) {
      return acc;
    }

    // returns array of marks, each having 'correctness' property
    const correctedAnswer = getAnswerCorrected({ sessionAnswers, marks });
    const correctMarks = correctedAnswer.filter(answer => answer.correctness === 'correct');

    const maxScore = marks.length;
    let score = correctMarks.length;

    // if extra placements
    if (correctedAnswer.length > maxScore) {
      score -= correctedAnswer.length - maxScore;
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
  }, {
    bestScore: 0,
    bestScoreAnswerKey: null,
    // initially we just suppose all the answers are incorrect
    answersCorrected: cloneDeep(sessionAnswers).map(answer => ({ ...answer, correctness: 'incorrect' })),
    foundOneSolution: false
  });
};

export const normalize = question => ({ ...defaults, ...question });

export function model(question, session, env) {
  return new Promise(resolve => {
    const normalizedQuestion = normalize(question);
    const { prompt, promptEnabled, graph, answers, ...questionProps } = normalizedQuestion || {};
    const { mode, role } = env || {};

    const base = {
      ...questionProps,
      answers,
      disabled: env.mode !== 'gather',
      prompt: promptEnabled ? prompt : null,
      rationale: null,
      size: graph,
      showToggle: env.mode === 'evaluate' && !isEmpty(answers),
      teacherInstructions: null,
    };

    if (role === 'instructor' && (mode === 'view' || mode === 'evaluate')) {
      const { rationale, rationaleEnabled, teacherInstructions, teacherInstructionsEnabled } = normalizedQuestion || {};

      base.rationale = rationaleEnabled ? rationale : null;
      base.teacherInstructions = teacherInstructionsEnabled ? teacherInstructions : null;
    }

    if (mode === 'evaluate') {
      if (!isEmpty(answers)) {
        const { answersCorrected, bestScoreAnswerKey, bestScore } = getBestAnswer(normalizedQuestion, session, env);

        // array of marks from session with 'correctness' property set
        base.answersCorrected = answersCorrected;
        base.correctResponse = bestScoreAnswerKey ? (answers[bestScoreAnswerKey] || {}).marks : [];
        base.showToggle = base.showToggle && bestScore !== 1;
      } else {
        base.answersCorrected = [];
        base.correctResponse = [];
      }
    }

    log('base: ', base);
    resolve(base);
  });
}

export function outcome(question, session, env = {}) {
  return new Promise(resolve => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    if (env.mode !== 'evaluate' || isEmpty(question.answers)) {
      resolve({ score: 0 });
    }

    const { bestScore } = getBestAnswer(question, session, env);

    resolve({ score: bestScore });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { answers } = question || {};
      let marks = [];

      if (answers && Object.values(answers)) {
        const firstCorrectAnswer = Object.values(answers)[0] || {};

        marks = firstCorrectAnswer.marks || [];
      }

      resolve({
        answer: marks,
        id: '1'
      });
    } else {
      resolve(null);
    }
  });
};
