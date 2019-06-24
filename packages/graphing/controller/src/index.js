import debug from 'debug';

import lodash from 'lodash';
import isEqual from 'lodash/isEqual';
import { tools } from '@pie-lib/graphing';

const { utils } = tools;
const { sinY, buildDataPoints, getAmplitudeAndFreq, FREQ_DIVIDER, parabolaFromTwoPoints } = utils;

const log = debug('@pie-element:graphing:controller');

const equalPoint = (A, B) => {
  // x1 = x2 & y1 = y2
  return isEqual(A.x, B.x) && isEqual(A.y, B.y);
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
  const sB = lodash.orderBy(sessAnswerPoints, 'x');
  const sD = lodash.orderBy(withoutDuplicates, 'x');

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

const mappedIsEqual = {
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
  const mappedMarks = {
    point: [],
    segment: [],
    line: [],
    ray: [],
    vector: [],
    polygon: [],
    circle: [],
    sine: [],
    parabola: []
  };
  marks.forEach(mark => mappedMarks[mark.type].push(mark));

  Object.keys(mappedMarks).forEach(key => {
    mappedMarks[key] = lodash.uniqWith(mappedMarks[key], mappedIsEqual[key]);
  });

  return mappedMarks;
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
    let correctnessMarks = {};


    if (env.mode === 'evaluate') {
      Object.keys(question.answers).map(answer => {
        const response = question.answers[answer];
        const marks = response.marks;
        correctnessMarks[answer] = [];

        // object that contains each mark in his particular section, without duplicates
        const noDuplicatesMappedMarks = eliminateDuplicates(marks);
        const noDuplicatesMappedSessionAnswers = eliminateDuplicates(session.answers);

        Object.keys(noDuplicatesMappedSessionAnswers).map(key => {
          if (key === 'polygon') {
            noDuplicatesMappedSessionAnswers[key].forEach(sessAnswer => {
              let index;

              noDuplicatesMappedMarks[key].forEach(poly => {
                index = equalPolygon(sessAnswer.points, poly.points);
              });

              if (index) {
                correctnessMarks[answer].push({ ...sessAnswer, correctness: 'correct' });
              } else {
                correctnessMarks[answer].push({ ...sessAnswer, correctness: 'incorrect' });
              }
            });
          } else {
            noDuplicatesMappedSessionAnswers[key].forEach(sessAnswer => {
              let index = noDuplicatesMappedMarks[key].find(mark => mappedIsEqual[key](sessAnswer, mark));

              if (index) {
                correctnessMarks[answer].push({ ...sessAnswer, correctness: 'correct' });
              } else {
                correctnessMarks[answer].push({ ...sessAnswer, correctness: 'incorrect' });
              }
            });
          }
        });
      });

      console.log(correctnessMarks);
      out.correctMarks = correctnessMarks;
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
