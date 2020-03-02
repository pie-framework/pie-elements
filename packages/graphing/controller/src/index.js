import debug from 'debug';

import cloneDeep from 'lodash/cloneDeep';
import lodash from 'lodash';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import { Decimal } from 'decimal.js';
import {
  buildDataPoints,
  getAmplitudeAndFreq,
  parabolaFromTwoPoints
} from '@pie-lib/graphing-utils';
import { partialScoring } from '@pie-lib/controller-utils';

const log = debug('@pie-element:graphing:controller');
const DecimalCustom = Decimal.clone({ precision: 5, rounding: 4 });

export const equalPoint = (A, B) => {
  // x1 = x2 & y1 = y2
  let equalLabel = true;

  if (A.label || B.label) {
    equalLabel = isEqual(A.label, B.label);
  }

  return isEqual(A.x, B.x) && isEqual(A.y, B.y) && equalLabel;
};

export const equalSegment = (segment1, segment2) => {
  // x1 = x3 & y1 = y3 & x2 = x4 & y2 = y4
  return ((isEqual(segment1.from, segment2.from) && isEqual(segment1.to, segment2.to)) ||
    ((isEqual(segment1.to, segment2.from) && isEqual(segment1.from, segment2.to))));
};

export const equalVector = (vector1, vector2) => {
  // x1 = x3 & y1 = y3 & x2 = x4 & y2 = y4
  return ((isEqual(vector1.from, vector2.from) && isEqual(vector1.to, vector2.to)));
};

const returnLineEquationCoefficients = line => {
  const xA = line.from.x;
  const yA = line.from.y;
  const xB = line.to.x;
  const yB = line.to.y;

  return {
    a: yB - yA,
    b: xA - xB,
    c: (xB * yA) - (xA * yB)
  };
};

export const equalLine = (line1, line2) => {
  // line equation: ax + by + c = 0
  // 2 lines are equal if a1/a2 = b1/b2 = c1/c2, where a, b, c are the coefficients in line equation

  // line equation knowing 2 points: (y - yA) / (yB - yA) = (x - xA) / (xB - xA)
  // extending this equation, we get: x * (yB - yA) + y * (xA - xB) + (xB * yA - xA * yB) = 0
  // where a = yB - yA; b = xA - xB; c = xB * yA - xA * yB

  const { a: a1, b: b1, c: c1 } = returnLineEquationCoefficients(line1);
  const { a: a2, b: b2, c: c2 } = returnLineEquationCoefficients(line2);

  const proportions = [];

  if (a2 !== 0) {
    proportions.push(new DecimalCustom(a1 / a2).toSignificantDigits().valueOf());
  } else if (a1 !== a2) {
    return false;
  }

  if (b2 !== 0) {
    proportions.push(new DecimalCustom(b1 / b2).toSignificantDigits().valueOf());
  } else if (b1 !== b2) {
    return false;
  }

  if (c2 !== 0) {
    proportions.push(new DecimalCustom(c1 / c2).toSignificantDigits().valueOf());
  } else if (c1 !== c2) {
    return false;
  }

  return lodash.uniq(proportions).length === 1;

  // (y2 - y1)/(x2 - x1) = (y4 - y3)/(x4 - x3);
  // return ((Math.abs((line1.to.y - line1.from.y) / (line1.to.x - line1.from.x))) === (Math.abs((line2.to.y - line2.from.y) / (line2.to.x - line2.from.x))));
};

export const equalRay = (ray1, ray2) => {
  // line & x1 = x3 & y1 = y3 & angle between (x1, y1) (x2, y2) is same as angle between (x3, y3) (x4, y4)

  return ((
        (ray1.to.y - ray1.from.y) / (ray1.to.x - ray1.from.x)
      ) === (
      (ray2.to.y - ray2.from.y) / (ray2.to.x - ray2.from.x))
    ) && (ray1.from.x === ray2.from.x && ray1.from.y === ray2.from.y) &&
    (
      Math.atan2(ray1.to.y - ray1.from.y, ray1.to.x - ray1.from.x) * 180 / Math.PI ===
      Math.atan2(ray2.to.y - ray2.from.y, ray2.to.x - ray2.from.x) * 180 / Math.PI
    );
};

export const equalPolygon = (pointsA, pointsB) => {
  const sessAnswerPoints = lodash.uniqWith(pointsA, isEqual);
  const withoutDuplicates = lodash.uniqWith(pointsB, isEqual);
  const sB = lodash.orderBy(sessAnswerPoints, ['x', 'y'], ['asc', 'asc']);
  const sD = lodash.orderBy(withoutDuplicates, ['x', 'y'], ['asc', 'asc']);

  return isEqual(sD, sB);
};

export const equalCircle = (c1, c2) => {
  const equalRootAndEdge = isEqual(c2.edge, c1.edge) && isEqual(c2.root, c1.root);
  const rAB = Math.sqrt(((c1.edge.x - c1.root.x) ** 2) + ((c1.edge.y - c1.root.y) ** 2));
  const rCD = Math.sqrt(((c2.edge.x - c2.root.x) ** 2) + ((c2.edge.y - c2.root.y) ** 2));
  const equalRAndRoot = isEqual(c2.root, c1.root) && isEqual(rAB, rCD);

  return equalRootAndEdge || equalRAndRoot;
};

export const equalSine = (sine1, sine2) => {
  const getPoints = ({ root, edge }) => {
    const { amplitude, freq } = getAmplitudeAndFreq(root, edge);
    // the height of the sine wave
    const tY = Math.abs(root.y - edge.y) * 2;
    // the distance on x axis between edge and root
    const tXRoot = Math.abs(root.x - edge.x);
    // the distance on x axis between 2 edges for sine wave (min & max)
    const tX = tXRoot * 2;
    // the first edge placed east side of root
    let edgeAboveZeroX = edge.x;
    let edgeAboveZeroY = edge.y;

    // if edge less then 0, find out the appropriate edge placed east side of zero (0)
    while (edgeAboveZeroX < 0 && tX !== 0) {
      edgeAboveZeroX = edgeAboveZeroX + tX;
      edgeAboveZeroY = edgeAboveZeroY < root.y ? edgeAboveZeroY + tY : edgeAboveZeroY - tY;
    }

    // if edge more then 0, find out the appropriate edge placed east side of zero (0)
    while (edgeAboveZeroX - tX > 0 && tX !== 0) {
      edgeAboveZeroX = edgeAboveZeroX - tX;
      edgeAboveZeroY = edgeAboveZeroY < root.y ? edgeAboveZeroY + tY : edgeAboveZeroY - tY;
    }

    return {
      amplitude: new DecimalCustom(amplitude).toSignificantDigits().valueOf(),
      freq: new DecimalCustom(freq).toSignificantDigits().valueOf(),
      min: new DecimalCustom(edge.y < root.y ? edge.y : edge.y - tY).toSignificantDigits().valueOf(),
      max: new DecimalCustom(edge.y < root.y ? edge.y + tY : edge.y).toSignificantDigits().valueOf(),
      edgeAboveZeroX: new DecimalCustom(edgeAboveZeroX).toSignificantDigits().valueOf(),
      edgeAboveZeroY: new DecimalCustom(edgeAboveZeroY).toSignificantDigits().valueOf()
    };
  };

  const studentAnswerBpY = getPoints(sine1);
  const correctAnswerBpY = getPoints(sine2);

  const {
    amplitude: amplitude1,
    freq: freq1,
    min: min1,
    max: max1,
    edgeAboveZeroX: edgeAboveZeroX1,
    edgeAboveZeroY: edgeAboveZeroY1
  } = studentAnswerBpY;

  console.log('\n\nstudentAnswerBpY ', sine1, 'amplitude', amplitude1, 'freq: ',freq1, 'min: ',min1, 'max: ',max1, 'edgeAboveZeroX:', edgeAboveZeroX1, 'edgeAboveZeroY', edgeAboveZeroY1);

  const {
    amplitude: amplitude2,
    freq: freq2,
    min: min2,
    max: max2,
    edgeAboveZeroX: edgeAboveZeroX2,
    edgeAboveZeroY: edgeAboveZeroY2
  } = correctAnswerBpY;

  console.log('correctAnswerBpY', sine2,' amplitude2', amplitude2, 'freq: ',freq2, 'min: ',min2, 'max: ',max2, 'edgeAboveZeroX:', edgeAboveZeroX2, 'edgeAboveZeroY', edgeAboveZeroY2);

  return (Math.abs(amplitude1) === Math.abs(amplitude2) &&
    Math.abs(freq1) === Math.abs(freq2) &&
    min1 === min2 && max1 === max2 &&
    edgeAboveZeroX1 === edgeAboveZeroX2 &&
    edgeAboveZeroY1 === edgeAboveZeroY2);
    // rootDiff1 === rootDiff2);
};

export const equalParabola = (p1, p2) => {
  const min = p1.root.x < p1.edge.x ? p1.root.x + (p1.root.x - p1.edge.x) : p1.edge.x;
  const max = p1.root.x < p1.edge.x ? p1.edge.x : p1.root.x + (p1.root.x - p1.edge.x);
  const minMark = p2.root.x < p2.edge.x ? p2.root.x + (p2.root.x - p2.edge.x) : p2.edge.x;
  const maxMark = p2.root.x < p2.edge.x ? p2.edge.x : p2.root.x + (p2.root.x - p2.edge.x);

  const getPoints = ({ root, edge }) => {
    const interval = 1;
    let bp = buildDataPoints(
      min,
      max,
      root,
      edge,
      interval,
      parabolaFromTwoPoints(root, edge)
    );

    return bp.map(bpp => bpp.y);
  };

  const studentAnswerBpY = getPoints(p1);
  const correctAnswerBpY = getPoints(p2);

  const nDif = lodash.differenceWith(studentAnswerBpY.reverse(), correctAnswerBpY, isEqual);
  const dif = lodash.differenceWith(studentAnswerBpY, correctAnswerBpY, isEqual);

  return (dif.length === 0 || nDif.length === 0) && min === minMark && max === maxMark;
};

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

const mapForIsEqual = {
  point: (sessAnswer, mark) => equalPoint(sessAnswer, mark),
  segment: (sessAnswer, mark) => equalSegment(sessAnswer, mark),
  line: (sessAnswer, mark) => equalLine(sessAnswer, mark),
  vector: (sessAnswer, mark) => equalVector(sessAnswer, mark),
  ray: (sessAnswer, mark) => equalRay(sessAnswer, mark),
  polygon: (sessAnswer, poly) => equalPolygon(sessAnswer.points, poly.points),
  circle: (sessAnswer, mark) => equalCircle(sessAnswer, mark),
  sine: (sessAnswer, mark) => equalSine(sessAnswer, mark),
  parabola: (sessAnswer, mark) => equalParabola(sessAnswer, mark),
};

export const eliminateDuplicates = (marks) => {
  const mappedMarks = initializeGraphMap();

  if (marks) {
    marks.forEach(mark => {
      if (mark && mark.type && mappedMarks[mark.type]) {
        mappedMarks[mark.type].push(mark);
      }
    });
  }

  Object.keys(mappedMarks).forEach(toolType => {
    mappedMarks[toolType] = lodash.uniqWith(mappedMarks[toolType], mapForIsEqual[toolType]);
  });

  return mappedMarks;
};

export const unMapMarks = (marks) => {
  const marksValues = Object.values(marks || {});

  if (!marksValues.length) {
    return [];
  }

  return marksValues.reduce((a, b) => ([...a, ...b]));
};

export const dichotomous = (answers, correctedMarks) => {
  let score = 0;

  if (!correctedMarks || isEmpty(correctedMarks)) {
    return {
      correctMarks: [],
      score
    };
  }

  let correctMarks = Object.values(correctedMarks)[0];

  Object.keys(answers || {}).map(answerKey => {
    // correct marks for this answer
    const marksArrayNoDuplicates = unMapMarks(eliminateDuplicates((answers[answerKey] || {}).marks));
    // selected marks
    const marksArrayWithCorrectnessNoDuplicates = unMapMarks(correctedMarks[answerKey]);

    // check if number of marks are equal and if all are correct
    if (marksArrayNoDuplicates.length === marksArrayWithCorrectnessNoDuplicates.length &&
      marksArrayWithCorrectnessNoDuplicates.length === marksArrayWithCorrectnessNoDuplicates.filter(
        cm => cm.correctness === 'correct').length) {
      score = 1;
      correctMarks = correctedMarks[answerKey];
    }
  });

  return {
    correctMarks: unMapMarks(correctMarks),
    score
  };
};

export const partial = (answers, correctedMarks) => {
  let bestScore = 0;

  if (!correctedMarks || isEmpty(correctedMarks)) {
    return {
      correctMarks: [],
      score: 0
    };
  }

  let correctMarks = Object.values(correctedMarks)[0];

  Object.keys(answers || {}).map(answerKey => {
    const marksArrayNoDuplicates = eliminateDuplicates((answers[answerKey] || {}).marks);
    let allCorrectScore = unMapMarks(marksArrayNoDuplicates).length;
    let score = 0;
    let scoredToolsCount = 0;
    const currentMarksWithCorrectnessValue = correctedMarks[answerKey];

    Object.keys(currentMarksWithCorrectnessValue || {}).forEach(correctMarkKey => {
      if (currentMarksWithCorrectnessValue[correctMarkKey] && currentMarksWithCorrectnessValue[correctMarkKey].length) {
        currentMarksWithCorrectnessValue[correctMarkKey].forEach(cM => {
          scoredToolsCount += 1;
          if (cM.correctness === 'incorrect') {
            score -= scoredToolsCount > allCorrectScore ? 1 : 0;
          } else {
            score += scoredToolsCount <= allCorrectScore ? 1 : 0;
          }
        });
      }
    });

    if (!bestScore || (score / allCorrectScore >= bestScore)) {
      bestScore = allCorrectScore ? score / allCorrectScore : bestScore;
      correctMarks = currentMarksWithCorrectnessValue;
    }
  });

  return {
    correctMarks: unMapMarks(correctMarks),
    score: parseFloat(bestScore.toFixed(2))
  };
};

export const getScore = (question, session, env = {}) => {
  // questionPossibleAnswers contains all possible answers (correct response and alternates);
  const { answers: questionPossibleAnswers } = question || {};

  // student's answers without DUPLICATES having the mapped form
  const sessionAnswers = eliminateDuplicates(cloneDeep(session && session.answer));
  let correctedMarks = {};
  const hasCorrectAnswer = filter(questionPossibleAnswers, prop => !isEmpty(prop)).length > 0;

  if (!hasCorrectAnswer) {
    return {
      correctMarks: [],
      score: 0
    };
  }

  // we iterate the possible answers and set in correctedMarks
  // answerKey can be: correctAnswer, alternate1, alternate2...
  Object.keys(questionPossibleAnswers).map(answerKey => {
    // for each possible answer
    const questionPossibleAnswer = questionPossibleAnswers[answerKey] || {};
    const { marks } = questionPossibleAnswer;
    // possible response (correctAnswer, alternate1, ...) without DUPLICATES
    const possibleAnswerMarks = eliminateDuplicates(marks);

    correctedMarks[answerKey] = initializeGraphMap();

    const elementExists = (sessAnswer, toolType) => {
      let index;
      const possibleAnswerMarksToolType = (toolType && possibleAnswerMarks[toolType]) || [];

      if (toolType === 'polygon') {
        possibleAnswerMarksToolType.forEach(poly => {
          index = equalPolygon(sessAnswer.points, poly.points);
        });
      } else {
        index = possibleAnswerMarksToolType.find(mark => mapForIsEqual[toolType](sessAnswer, mark));
      }

      return index;
    };

    // check each response that student selected and set the correctness value
    Object.keys(sessionAnswers).map(toolType => {
      sessionAnswers[toolType].forEach(sessAnswer => {
        if (elementExists(sessAnswer, toolType)) {
          sessAnswer.correctness = 'correct';
        } else {
          sessAnswer.correctness = 'incorrect';
        }

        if (answerKey && toolType && correctedMarks[answerKey] && correctedMarks[answerKey][toolType]) {
          correctedMarks[answerKey][toolType].push(cloneDeep(sessAnswer));
        }
      });
    });
  });

  const isPartialScoring = partialScoring.enabled(question, env, question.scoringType === 'partial scoring');

  if (isPartialScoring) {
    return partial(questionPossibleAnswers, correctedMarks);
  }

  return dichotomous(questionPossibleAnswers, correctedMarks);
};

export const normalize = question => ({
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

export function model(question, session, env) {
  return new Promise(resolve => {
    const normalizedQuestion = normalize(question);
    const {
      backgroundMarks,
      domain,
      prompt,
      promptEnabled,
      range,
      title,
      labels,
      xAxisLabel,
      yAxisLabel,
      tools,
      graph,
      toolbarTools
    } = normalizedQuestion;

    const correctInfo = { correctness: 'incorrect', score: '0%' };

    const base = {
      correctness: correctInfo,
      disabled: env.mode !== 'gather',
      backgroundMarks,
      domain,
      prompt: promptEnabled ? prompt : null,
      range,
      title,
      labels,
      xAxisLabel,
      yAxisLabel,
      tools,
      size: graph,
      toolbarTools
    };

    if (env.mode === 'evaluate') {
      const result = getScore(normalizedQuestion, session, env);

      base.answersCorrected = result.correctMarks;
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      base.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      base.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled ? normalizedQuestion.teacherInstructions : null;
    } else {
      base.rationale = null;
      base.teacherInstructions = null;
    }

    log('base: ', base);
    resolve(base);
  });
}

export function outcome(model, session, env = {}) {
  return new Promise(resolve => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    resolve({ score: getScore(model, session, env).score });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { answers } = question;
      let marks = [];

      if (answers && Object.values(answers)) {
        const firstCorrectAnswer = Object.values(answers)[0];

        marks = firstCorrectAnswer ? firstCorrectAnswer.marks : [];
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

