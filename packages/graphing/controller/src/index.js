import debug from 'debug';

import lodash from 'lodash';
import isEqual from 'lodash/isEqual';
import { tools } from '@pie-lib/graphing';

const { utils } = tools;
const { sinY, buildDataPoints, getAmplitudeAndFreq, FREQ_DIVIDER, parabolaFromTwoPoints } = utils;

const log = debug('@pie-element:graphing:controller');

const equalPoint = (A, B) => {
  // x1 = x2 & y1 = y2
  let equalLabel = true;

  if (A.label || B.label) {
    equalLabel = isEqual(A.label, B.label);
  }

  return isEqual(A.x, B.x) && isEqual(A.y, B.y) && equalLabel;
};

const equalSegment = (A, B, C, D) => {
  // x1 = x3 & y1 = y3 & x2 = x4 & y2 = y4
  return ((isEqual(A, C) && isEqual(B, D)) || ((isEqual(B, C) && isEqual(A, D))));
};

const equalVector = (A, B, C, D) => {
  // x1 = x3 & y1 = y3 & x2 = x4 & y2 = y4
  return ((isEqual(A, C) && isEqual(B, D)));
};

const equalLine = (A, B, C, D) => {
  // (y2 - y1)/(x2 - x1) = (y4 - y3)/(x4 - x3);
  return (((B.y - A.y) / (B.x - A.x)) === ((D.y - C.y) / (D.x - C.x)));
};

const equalRay = (A, B, C, D) => {
  // line & x1 = x3 & y1 = y3 & angle between (x1, y1) (x2, y2) is same as angle between (x3, y3) (x4, y4)
  return ((
        (B.y - A.y) / (B.x - A.x)
      ) === (
      (D.y - C.y) / (D.x - C.x))
    ) && (A.x === C.x && A.y === C.y) &&
    (
      Math.atan2(B.y - A.y, B.x - A.x) * 180 / Math.PI ===
      Math.atan2(D.y - C.y, D.x - C.x) * 180 / Math.PI
    );
};

const equalPolygon = (pointsA, pointsB) => {
  const sessAnswerPoints = lodash.uniqWith(pointsA, isEqual);
  const withoutDuplicates = lodash.uniqWith(pointsB, isEqual);
  const sB = lodash.orderBy(sessAnswerPoints, ['x','y'], ['asc', 'asc']);
  const sD = lodash.orderBy(withoutDuplicates, ['x','y'], ['asc', 'asc']);

  return isEqual(sD, sB);
};

const equalCircle = (A, B, C, D) => {
  const equalRootAndEdge = isEqual(D, B) && isEqual(C, A);
  const equalRAndRoot = isEqual(C, A) && isEqual(Math.abs(D.x - C.x), Math.abs(B.x - A.x));

  if (equalRootAndEdge || equalRAndRoot) {
    return { C, D };
  } else {
    return null;
  }
};

const equalSine = (A, B, C, D) => {
  const getPoints = (root, edge) => {
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

  const studentAnswerBpY = getPoints(A, B);
  const correctAnswerBpY = getPoints(C, D);
  const nDif = lodash.differenceWith(studentAnswerBpY.map(s => -s).reverse(), correctAnswerBpY, isEqual);
  const dif = lodash.differenceWith(studentAnswerBpY, correctAnswerBpY, isEqual);

  return dif.length === 0 || nDif.length === 0;
};

const equalParabola = (A, B, C, D) => {
  const min = A.x < B.x ? A.x + (A.x - B.x) : B.x;
  const max = A.x < B.x ? B.x : A.x + (A.x - B.x);
  const minMark = C.x < D.x ? C.x + (C.x - D.x) : D.x;
  const maxMark = C.x < D.x ? D.x : C.x + (C.x - D.x);

  const getPoints = (root, edge) => {
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

  const studentAnswerBpY = getPoints(A, B);
  const correctAnswerBpY = getPoints(C, D);

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
  segment: (sessAnswer, mark) => equalSegment(sessAnswer.from, sessAnswer.to, mark.from, mark.to),
  line: (sessAnswer, mark) => equalLine(sessAnswer.from, sessAnswer.to, mark.from, mark.to),
  vector: (sessAnswer, mark) => equalVector(sessAnswer.from, sessAnswer.to, mark.from, mark.to),
  ray: (sessAnswer, mark) => equalRay(sessAnswer.from, sessAnswer.to, mark.from, mark.to),
  polygon: (sessAnswer, poly) => equalPolygon(sessAnswer.points, poly.points),
  circle: (sessAnswer, mark) => equalCircle(sessAnswer.root, sessAnswer.edge, mark.root, mark.edge),
  sine: (sessAnswer, mark) => equalSine(sessAnswer.root, sessAnswer.edge, mark.root, mark.edge),
  parabola: (sessAnswer, mark) => equalParabola(sessAnswer.root, sessAnswer.edge, mark.root, mark.edge),
};

const eliminateDuplicates = (marks) => {
  const mappedMarks = initializeGraphMap();

  if (marks) {
    marks.forEach(mark => mappedMarks[mark.type].push(mark));
  }

  Object.keys(mappedMarks).forEach(toolType => {
    mappedMarks[toolType] = lodash.uniqWith(mappedMarks[toolType], mapForIsEqual[toolType]);
  });

  return mappedMarks;
};

const unMapMarks = (marks) => Object.values(marks).reduce((a, b) => ([...a, ...b]));

const dichotomous = (answers, marksWithCorrectnessValue) => {
  let correctAnswer = Object.keys(marksWithCorrectnessValue)[0];
  let correctMarks = Object.values(marksWithCorrectnessValue)[0];
  let score = '0%';

  Object.keys(answers).map(answerKey => {
    // correct marks for this answer
    const marksArrayNoDuplicates = unMapMarks(eliminateDuplicates(answers[answerKey].marks));
    // selected marks
    const marksArrayWithCorrectnessNoDuplicates = unMapMarks(marksWithCorrectnessValue[answerKey]);

    // check if number of marks are equal and if all are correct
    if (marksArrayNoDuplicates.length === marksArrayWithCorrectnessNoDuplicates.length &&
      marksArrayWithCorrectnessNoDuplicates.length === marksArrayWithCorrectnessNoDuplicates.filter(
        cm => cm.correctness === 'correct').length) {
      score = '100%';
      correctAnswer = answerKey;
      correctMarks = marksWithCorrectnessValue[answerKey];
    }
  });

  return {
    correctMarks: unMapMarks(correctMarks),
    score,
    correctAnswer
  };
};

const partial = (answers, marksWithCorrectnessValue) => {
  let correctAnswer = Object.keys(marksWithCorrectnessValue)[0];
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
          score = scoredToolsCount > allCorrectScore ? score - 1 : score;
        } else {
          score += 1;
        }
      });
    });

    if (!bestScore || score / allCorrectScore >= bestScore) {
      bestScore = score / allCorrectScore;
      correctMarks = marksWithCorrectnessValue[answerKey];
      correctAnswer = answerKey;
    }
  });

  bestScore = (bestScore < 0 ? 0 : bestScore) * 100;

  return {
    correctMarks: unMapMarks(correctMarks),
    score: `${bestScore.toFixed(2)}%`,
    correctAnswer
  };
};

const getScore = (question, session) => {
  const { answers } = question;

  // student's answers without DUPLICATES having the mapped form
  const sessionAnswersMappedNoDuplicates = eliminateDuplicates(session.answers);
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

        marksWithCorrectnessValue[answerKey][toolType].push(sessAnswer);
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
      answers,
      domain,
      prompt,
      range,
      rationale,
      title,
      xAxisLabel,
      yAxisLabel,
      displayedTools
    } = question;

    const correctInfo = { correctness: 'incorrect', score: '0%' };

    const base = {
      correctness: correctInfo,
      disabled: env.mode !== 'gather',
      backgroundMarks,
      domain,
      prompt,
      range,
      rationale,
      title,
      xAxisLabel,
      yAxisLabel,
      displayedTools,
    };

    const out = Object.assign(base, {
      correctResponse: env.mode === 'evaluate' ? answers : undefined
    });

    if (env.mode === 'evaluate') {
      const result = getScore(question, session);

      out.correctMarks = result.correctMarks;
      out.correctAnswer = result.correctAnswer;
      out.score = result.score;
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.rationale = question.rationale;
    } else {
      out.rationale = null;
    }

    log('out: ', out);
    resolve(out);
  });
}
