import debug from 'debug';
import cloneDeep from 'lodash/cloneDeep';
import uniqWith from 'lodash/uniqWith';
import isEmpty from 'lodash/isEmpty';
import defaults from './defaults';
import { equalMarks, sortedAnswers, removeInvalidAnswers } from './utils';

const log = debug('@pie-element:graphing-solution-set:controller');

const initializeGraphMap = () => ({
  line: [],
});

/*
 * Function to compare two marks
 * @param {Object} mark1 - first mark
 * @param {Object} mark2 - second mark
 * */
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

/*
 * Function to get the corrected answer
 * @param {Object} sessionAnswers - array of marks from session
 * @param {Object} marks - array of marks from correct answer
 * */
export const getAnswerCorrected = ({ sessionAnswers, marks: correctAnswers }) => {
  sessionAnswers = sessionAnswers || [];
  correctAnswers = correctAnswers || [];
  const rez = cloneDeep(sessionAnswers).reduce((correctedAnswer, answer) => {
    const answerIsCorrect = correctAnswers.find((mark) => compareMarks(answer, mark));
    answer.correctness = answerIsCorrect ? 'correct' : 'incorrect';
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

/*
 * Function to get the best answer
 * @param {Object} question - question object
 * @param {Object} session - session object
 * @param {Object} env - env object
 * */
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
        acc.bestScore = Math.floor(score / maxScore);
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

/*
 * Constant normalize
 * @param {Object} question - question object
 * */
export const normalize = (question) => ({ ...defaults, ...question });

/*
 * Function to set model
 * @param {Object} question - question object
 * @param {Object} session - session object
 * @param {Object} env - env object
 * */
export function model(question, session, env) {
  return new Promise((resolve) => {
    const normalizedQuestion = normalize(question);
    // ensure removing of invalid answers
    // need this if undo redo was last operation
    session.answer = removeInvalidAnswers(session.answer);
    // console.log('normalizedQuestion', normalizedQuestion);
    const { defaultTool, extraCSSRules, prompt, promptEnabled, graph, answers, toolbarTools, ...questionProps } =
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

    const base = {
      ...questionProps,
      answers,
      arrows,
      defaultTool: 'line',
      disabled: env.mode !== 'gather',
      prompt: promptEnabled ? prompt : null,
      rationale: null,
      size: graph,
      showToggle:
        env.mode === 'evaluate' &&
        !isEmpty(answers) &&
        answers.correctAnswer &&
        answers.correctAnswer.marks &&
        !isEmpty(answers.correctAnswer.marks),
      teacherInstructions: null,
      toolbarTools,
      extraCSSRules,
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
        base.answersCorrected = answersCorrected;
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

/*
 * Function to check the outcome
 * @param {Object} question - question object
 * @param {Object} session - session object
 * @param {Object} env - env object
 * */
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

/*
 * Constant to create correct response session
 * @param {Object} question - question object
 * @param {Object} env - env object
 * */
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

/*
 * Constant to validate model before saving item
 * @param {Object} model - model object
 * */
export const validate = (model = {}) => {
  const { answers, gssLineData } = model;
  const errors = {};
  const correctAnswerErrors = {};
  let found = false;
  if (gssLineData.numberOfLines === 1) {
    if (answers.correctAnswer.marks.length < 1) {
      found = true;
      correctAnswerErrors.correctAnswer = 'At least 1 line object should be defined.';
    } else if (answers.correctAnswer.marks.length === 1 && answers.correctAnswer.marks[0].building) {
      found = true;
      correctAnswerErrors.correctAnswer = '1 or more graph object should be correctly defined.';
    }
  } else {
    if (answers.correctAnswer.marks.length < 2) {
      found = true;
      correctAnswerErrors.correctAnswer = 'At least 2 line object should be defined.';
    } else if (answers.correctAnswer.marks.length === 2) {
      if (answers.correctAnswer.marks[0].building || answers.correctAnswer.marks[1].building) {
        found = true;
        correctAnswerErrors.correctAnswer = '1 or more graph object should be correctly defined.';
      }
    }
  }
  let polygon = answers.correctAnswer.marks.find((mark) => mark.type === 'polygon');
  if (!found && (!gssLineData.selectedTool === 'solutionSet' || !polygon)) {
    correctAnswerErrors.correctAnswer = 'Please select a solution set for the graphing solution set item.';
  }
  if (!isEmpty(correctAnswerErrors)) {
    errors.correctAnswerErrors = correctAnswerErrors;
  }
  return errors;
};
