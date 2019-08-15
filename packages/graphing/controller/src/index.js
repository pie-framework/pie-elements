import debug from 'debug';

import cloneDeep from 'lodash/cloneDeep';
import lodash from 'lodash';
import isEqual from 'lodash/isEqual';
import { sinY, buildDataPoints, getAmplitudeAndFreq, FREQ_DIVIDER, parabolaFromTwoPoints } from '@pie-lib/graphing-utils';

const log = debug('@pie-element:graphing:controller');

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

export const equalLine = (line1, line2) => {
  // (y2 - y1)/(x2 - x1) = (y4 - y3)/(x4 - x3);
  return (((line1.to.y - line1.from.y) / (line1.to.x - line1.from.x)) === ((line2.to.y - line2.from.y) / (line2.to.x - line2.from.x)));
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
  const sB = lodash.orderBy(sessAnswerPoints, ['x','y'], ['asc', 'asc']);
  const sD = lodash.orderBy(withoutDuplicates, ['x','y'], ['asc', 'asc']);

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
    const interval = freq / FREQ_DIVIDER;
    const t = root.x + (root.x - edge.x);
    const min = t < edge.x ? t : edge.x + (edge.x - t);
    const max = t >= edge.x ? t : edge.x + (edge.x - t);
    const bp = buildDataPoints(
      min,
      max,
      root,
      edge,
      interval,
      sinY(amplitude, freq, { phase: root.x, vertical: root.y })
    );

    return bp.filter(bpp => bpp.x < max && bpp.x > min).map(bpp => bpp.y);
  };

  const studentAnswerBpY = getPoints(sine1);
  const correctAnswerBpY = getPoints(sine2);
  const nDif = lodash.differenceWith(studentAnswerBpY.map(s => -s).reverse(), correctAnswerBpY, isEqual);
  const dif = lodash.differenceWith(studentAnswerBpY, correctAnswerBpY, isEqual);

  return dif.length === 0 || nDif.length === 0;
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
    marks.forEach(mark => mappedMarks[mark.type].push(mark));
  }

  Object.keys(mappedMarks).forEach(toolType => {
    mappedMarks[toolType] = lodash.uniqWith(mappedMarks[toolType], mapForIsEqual[toolType]);
  });

  return mappedMarks;
};

export const unMapMarks = (marks) => Object.values(marks).reduce((a, b) => ([...a, ...b]));

export const dichotomous = (answers, marksWithCorrectnessValue) => {
  let correctMarks = Object.values(marksWithCorrectnessValue)[0];
  let score = 0;

  Object.keys(answers).map(answerKey => {
    // correct marks for this answer
    const marksArrayNoDuplicates = unMapMarks(eliminateDuplicates(answers[answerKey].marks));
    // selected marks
    const marksArrayWithCorrectnessNoDuplicates = unMapMarks(marksWithCorrectnessValue[answerKey]);

    // check if number of marks are equal and if all are correct
    if (marksArrayNoDuplicates.length === marksArrayWithCorrectnessNoDuplicates.length &&
      marksArrayWithCorrectnessNoDuplicates.length === marksArrayWithCorrectnessNoDuplicates.filter(
        cm => cm.correctness === 'correct').length) {
      score = 1;
      correctMarks = marksWithCorrectnessValue[answerKey];
    }
  });

  return {
    correctMarks: unMapMarks(correctMarks),
    score
  };
};

export const partial = (answers, marksWithCorrectnessValue) => {
  let correctMarks = Object.values(marksWithCorrectnessValue)[0];
  let bestScore = 0;


  Object.keys(answers).map(answerKey => {
    const marksArrayNoDuplicates = eliminateDuplicates(answers[answerKey].marks);
    let allCorrectScore = unMapMarks(marksArrayNoDuplicates).length;
    let score = 0;
    let scoredToolsCount = 0;

    Object.keys(marksWithCorrectnessValue[answerKey]).forEach(correctMarkKey => {
      marksWithCorrectnessValue[answerKey][correctMarkKey].forEach(cM => {
        scoredToolsCount += 1;
        if (cM.correctness === 'incorrect') {
          score -= scoredToolsCount > allCorrectScore ? 1 : 0;
        } else {
          score += scoredToolsCount <= allCorrectScore ? 1 : 0;
        }
      });
    });

    if (!bestScore || (score / allCorrectScore >= bestScore)) {
      bestScore = score / allCorrectScore;
      correctMarks = marksWithCorrectnessValue[answerKey];
    }
  });

  return {
    correctMarks: unMapMarks(correctMarks),
    score: parseFloat(bestScore.toFixed(2))
  };
};

export const getScore = (question, session) => {
  const { answers } = question;

  // student's answers without DUPLICATES having the mapped form
  const sessionAnswersMappedNoDuplicates = eliminateDuplicates(cloneDeep(session.answer));
  let marksWithCorrectnessValue = {};

  if (!answers) {
    return {};
  }

  // answers contains all possible answers (correctResponse and alternates);
  // answerKey: correctAnswer, alternate1, alternate2...
  // we iterate the possible answers and set in marksWithCorrectnessValue
  Object.keys(answers).map(answerKey => {
    // for each possible answer
    const { marks } = answers[answerKey];
    marksWithCorrectnessValue[answerKey] = initializeGraphMap();

    // possible response (correctAnswer, alternate1, ...) without DUPLICATES
    const possibleAnswerMappedNoDuplicates = eliminateDuplicates(marks);

    const elementExists = (sessAnswer, toolType) => {
      let index;

      if (toolType === 'polygon') {
        possibleAnswerMappedNoDuplicates[toolType].forEach(poly => {
          index = equalPolygon(sessAnswer.points, poly.points);
        });
      } else {
        index = possibleAnswerMappedNoDuplicates[toolType].find(mark => mapForIsEqual[toolType](sessAnswer, mark));
      }

      return index;
    };

    // check each response that student selected and set the correctness value
    Object.keys(sessionAnswersMappedNoDuplicates).map(toolType => {
      sessionAnswersMappedNoDuplicates[toolType].forEach(sessAnswer => {
        if (elementExists(sessAnswer, toolType)) {
          sessAnswer.correctness = 'correct';
        } else {
          sessAnswer.correctness = 'incorrect';
        }

        marksWithCorrectnessValue[answerKey][toolType].push(cloneDeep(sessAnswer));
      });
    });
  });

  if (question.scoringType === 'dichotomous') {
    return dichotomous(answers, marksWithCorrectnessValue);
  } else {
    return partial(answers, marksWithCorrectnessValue);
  }
};

export function model(question, session, env) {
  return new Promise(resolve => {
    const {
      backgroundMarks,
      domain,
      prompt,
      range,
      rationale,
      title,
      labels,
      xAxisLabel,
      yAxisLabel,
      tools,
      graph,
      toolbarTools
    } = question;

    const correctInfo = { correctness: 'incorrect', score: '0%' };

    const base = {
      correctness: correctInfo,
      disabled: env.mode !== 'gather',
      backgroundMarks,
      domain,
      prompt,
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
      const result = getScore(question, session);

      base.answersCorrected = result.correctMarks;
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      base.rationale = question.rationale;
      base.teacherInstructions = question.teacherInstructions;
    } else {
      base.rationale = null;
      base.teacherInstructions = null;
    }

    log('base: ', base);
    resolve(base);
  });
}

export function outcome(model, session) {
  return new Promise(resolve => {
    resolve({ score: getScore(model, session).score });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { answers: { correctAnswer: { marks } } } = question;

      resolve({
        answer: marks,
        id: '1'
      });
    }
  });
};
