import isEqual from 'lodash/isEqual';
import lodash from 'lodash';
import uniqWith from 'lodash/uniqWith';
import differenceWith from 'lodash/differenceWith';
import { getAmplitudeAndFreq, pointsToABC } from '@pie-lib/graphing-utils';

export const equalPoint = (A, B) => {
  // x1 = x2 & y1 = y2
  let equalLabel = true;

  if (A.label || B.label) {
    equalLabel = isEqual(A.label, B.label);
  }

  return isEqual(A.x, B.x) && isEqual(A.y, B.y) && equalLabel;
};

export const equalSegment = (segment1, segment2) => {
  // A.from = B.from, A.to = B.to OR A.from = B.to, A.to = B.from
  // x1 = x3 & y1 = y3 & x2 = x4 & y2 = y4
  return ((isEqual(segment1.from, segment2.from) && isEqual(segment1.to, segment2.to)) ||
    ((isEqual(segment1.to, segment2.from) && isEqual(segment1.from, segment2.to))));
};

export const equalVector = (vector1, vector2) => {
  // A.from = B.from, A.to = B.to;
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

const getSignificantDecimals = number => Math.round(number * 10000) / 10000;

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
    proportions.push(getSignificantDecimals((a1 / a2)));
  } else if (a1 !== a2) {
    return false;
  }

  if (b2 !== 0) {
    proportions.push(getSignificantDecimals((b1 / b2)));
  } else if (b1 !== b2) {
    return false;
  }

  if (c2 !== 0) {
    proportions.push(getSignificantDecimals(c1 / c2));
  } else if (c1 !== c2) {
    return false;
  }

  return lodash.uniq(proportions).length === 1;

  // (y2 - y1)/(x2 - x1) = (y4 - y3)/(x4 - x3);
  // return ((Math.abs((line1.to.y - line1.from.y) / (line1.to.x - line1.from.x))) === (Math.abs((line2.to.y - line2.from.y) / (line2.to.x - line2.from.x))));
};

export const equalRay = (ray1, ray2) => {
  // slope: m = (y2-y1)/(x2-x1)
  // slope & x1 = x3 & y1 = y3 & angle between (x1, y1) (x2, y2) is same as angle between (x3, y3) (x4, y4)
  const mRay1 = (ray1.to.y - ray1.from.y) / (ray1.to.x - ray1.from.x);
  const mRay2 = (ray2.to.y - ray2.from.y) / (ray2.to.x - ray2.from.x);
  const angleRay1 = Math.atan2(ray1.to.y - ray1.from.y, ray1.to.x - ray1.from.x) * 180 / Math.PI;
  const angleRay2 = Math.atan2(ray2.to.y - ray2.from.y, ray2.to.x - ray2.from.x) * 180 / Math.PI;

  return mRay1 === mRay2 && ray1.from.x === ray2.from.x && ray1.from.y === ray2.from.y && angleRay1 === angleRay2;
};

export const constructSegmentsFromPoints = points => {
  // takes the list of points that represent a polygon and transforms it into a list of segments; eg.:
  // points: A, B, C, D => segments: AB, BC, CD, DA
  return (points || []).map((point, index) => ({ from: point, to: points[(index + 1) % points.length] }));
};

export const removeDuplicateSegments = segments => {
  segments = segments || [];
  // removes segments that are duplicates; eg. These segments are the same, so one will be removed:
  // segment1: from: { x: 1, y: 1 }, to: { x: 2, y: 1 }
  // segment2: from: { x: 2, y: 1 }, to: { x: 1, y: 1 }
  return uniqWith(segments, (s1, s2) => equalSegment(s1, s2));
};

export const removeInvalidSegments = segments => {
  segments = segments || [];
  // removes segments that start in a point and end in the same point (eg.: from: { x: 1, y: 1 }, to: { x: 1, y: 1 })

  return segments.filter(segment => !isEqual(segment.from, segment.to));
};

export const equalPolygon = (poly1, poly2) => {
  const { points: points1 } = poly1;
  const { points: points2 } = poly2;

  // generate segments
  const segments1 = constructSegmentsFromPoints(points1);
  const segments2 = constructSegmentsFromPoints(points2);

  const segments1NoDuplicates = removeDuplicateSegments(removeInvalidSegments(segments1));
  const segments2NoDuplicates = removeDuplicateSegments(removeInvalidSegments(segments2));

  const differentSegments1 = differenceWith(segments1NoDuplicates, segments2NoDuplicates, equalSegment);
  const differentSegments2 = differenceWith(segments2NoDuplicates, segments1NoDuplicates, equalSegment);

  return (!differentSegments1 || !differentSegments1.length) && (!differentSegments2 || !differentSegments2.length);
};

export const equalCircle = (c1, c2) => {
  const equalRootAndEdge = isEqual(c2.edge, c1.edge) && isEqual(c2.root, c1.root);

  // if both edge and root are the same, it means the shapes are exactly the same
  if (equalRootAndEdge) return true;

  const rC1 = Math.sqrt(((c1.edge.x - c1.root.x) ** 2) + ((c1.edge.y - c1.root.y) ** 2));
  const rC2 = Math.sqrt(((c2.edge.x - c2.root.x) ** 2) + ((c2.edge.y - c2.root.y) ** 2));

  // if both root and radius are the same, it means the shapes are equal
  return isEqual(c2.root, c1.root) && isEqual(rC1, rC2);
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
      amplitude: getSignificantDecimals(amplitude),
      freq: getSignificantDecimals(freq),
      min: getSignificantDecimals(edge.y < root.y ? edge.y : edge.y - tY),
      max: getSignificantDecimals(edge.y < root.y ? edge.y + tY : edge.y),
      edgeAboveZeroX: getSignificantDecimals(edgeAboveZeroX),
      edgeAboveZeroY: getSignificantDecimals(edgeAboveZeroY)
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
  const {
    amplitude: amplitude2,
    freq: freq2,
    min: min2,
    max: max2,
    edgeAboveZeroX: edgeAboveZeroX2,
    edgeAboveZeroY: edgeAboveZeroY2
  } = correctAnswerBpY;

  return (Math.abs(amplitude1) === Math.abs(amplitude2) &&
    Math.abs(freq1) === Math.abs(freq2) &&
    min1 === min2 && max1 === max2 &&
    edgeAboveZeroX1 === edgeAboveZeroX2 &&
    edgeAboveZeroY1 === edgeAboveZeroY2);
  // rootDiff1 === rootDiff2);
};

export const equalParabola = (p1, p2) => {
  const { edge: edgeP1, root: rootP1 } = p1;
  const { edge: edgeP2, root: rootP2 } = p2;
  const p1edge = edgeP1 || { ...rootP1 };
  const p2edge = edgeP2 || { ...rootP2 };

  const p1mirrorEdge = { x: rootP1.x - (p1edge.x - rootP1.x), y: p1edge.y };
  const p2mirrorEdge = { x: rootP2.x - (p2edge.x - rootP2.x), y: p2edge.y };

  const { a: a1, b: b1, c: c1 } = pointsToABC(rootP1, edgeP1, p1mirrorEdge);
  const { a: a2, b: b2, c: c2 } = pointsToABC(rootP2, edgeP2, p2mirrorEdge);

  // sometimes numbers have this form: 1.00000000002 because of calculations, we have to round them
  const round = number => Math.round(number * 10000) / 10000;

  return round(a1) === round(a2) && round(b1) === round(b2) && round(c1) === round(c2);
};

export const equalMarks = {
  circle: (sessAnswer, mark) => equalCircle(sessAnswer, mark),
  line: (sessAnswer, mark) => equalLine(sessAnswer, mark),
  parabola: (sessAnswer, mark) => equalParabola(sessAnswer, mark),
  point: (sessAnswer, mark) => equalPoint(sessAnswer, mark),
  polygon: (sessAnswer, poly) => equalPolygon(sessAnswer, poly),
  ray: (sessAnswer, mark) => equalRay(sessAnswer, mark),
  segment: (sessAnswer, mark) => equalSegment(sessAnswer, mark),
  sine: (sessAnswer, mark) => equalSine(sessAnswer, mark),
  vector: (sessAnswer, mark) => equalVector(sessAnswer, mark),
};
