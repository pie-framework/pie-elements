import isEqual from 'lodash/isEqual';
import lodash from 'lodash';
import uniqWith from 'lodash/uniqWith';
import differenceWith from 'lodash/differenceWith';

/*
 * Constant to check equal segments
 * @param {Object} segment1 - segment 1
 * @param {Object} segment2 - segment 2
 * */
export const equalSegment = (segment1, segment2) => {
  // A.from = B.from, A.to = B.to OR A.from = B.to, A.to = B.from
  // x1 = x3 & y1 = y3 & x2 = x4 & y2 = y4
  return (
    (isEqual(segment1.from, segment2.from) && isEqual(segment1.to, segment2.to)) ||
    (isEqual(segment1.to, segment2.from) && isEqual(segment1.from, segment2.to))
  );
};

// this function is implemented in configure as well
/*
 * Constant to get sorted answers
 * @param {Object} answers - answers
 * */
export const sortedAnswers = (answers) =>
  Object.keys(answers || {})
    .sort()
    .reduce((result, key) => {
      if (key !== 'correctAnswer') {
        result[key] = answers[key];
      }
      return result;
    }, {});

/*
 * Constant to return line equation coefficients
 * @param {Object} line - line
 * */
const returnLineEquationCoefficients = (line) => {
  line = { ...line, to: { ...line.to }, from: { ...line.from } };
  const xA = line.from.x;
  const yA = line.from.y;
  const xB = line.to.x;
  const yB = line.to.y;
  return {
    a: yB - yA,
    b: xA - xB,
    c: xB * yA - xA * yB,
  };
};

/*
 * Constant to get significant decimals
 * @param {Number} number - number
 * */
const getSignificantDecimals = (number) => Math.round(number * 10000) / 10000;

/*
 * Constant to check equal lines
 * @param {Object} line1 - line 1
 * @param {Object} line2 - line 2
 * */
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
    proportions.push(getSignificantDecimals(a1 / a2));
  } else if (a1 !== a2) {
    return false;
  }
  if (b2 !== 0) {
    proportions.push(getSignificantDecimals(b1 / b2));
  } else if (b1 !== b2) {
    return false;
  }
  if (c2 !== 0) {
    proportions.push(getSignificantDecimals(c1 / c2));
  } else if (c1 !== c2) {
    return false;
  }
  return lodash.uniq(proportions).length === 1 && line1.fill === line2.fill;
  // (y2 - y1)/(x2 - x1) = (y4 - y3)/(x4 - x3);
  // return ((Math.abs((line1.to.y - line1.from.y) / (line1.to.x - line1.from.x))) === (Math.abs((line2.to.y - line2.from.y) / (line2.to.x - line2.from.x))));
};

/*
 * Constant to construct segments from points
 * @param {Array} points - points
 * */
export const constructSegmentsFromPoints = (points) => {
  // takes the list of points that represent a polygon and transforms it into a list of segments; eg.:
  // points: A, B, C, D => segments: AB, BC, CD, DA
  return (points || []).map((point, index) => ({ from: point, to: points[(index + 1) % points.length] }));
};

/*
 * Constant to remove duplicate segments
 * @param {Array} segments - segments
 * */
export const removeDuplicateSegments = (segments) => {
  segments = segments || [];
  // removes segments that are duplicates; eg. These segments are the same, so one will be removed:
  // segment1: from: { x: 1, y: 1 }, to: { x: 2, y: 1 }
  // segment2: from: { x: 2, y: 1 }, to: { x: 1, y: 1 }
  return uniqWith(segments, (s1, s2) => equalSegment(s1, s2));
};

/*
 * Constant to remove invalid segments
 * @param {Array} segments - segments
 * */
export const removeInvalidSegments = (segments) => {
  segments = segments || [];
  // removes segments that start in a point and end in the same point (eg.: from: { x: 1, y: 1 }, to: { x: 1, y: 1 })
  return segments.filter((segment) => !isEqual(segment.from, segment.to));
};

/*
 * Constant to check equal polygons
 * @param {Object} poly1 - polygon 1 points
 * @param {Object} poly2 - polygon 2 points
 * */
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

/*
 * Constant to compare equal marks
 * */
export const equalMarks = {
  line: (sessAnswer, mark) => equalLine(sessAnswer, mark),
  polygon: (sessAnswer, poly) => equalPolygon(sessAnswer, poly),
};

/*
 * Check if a point is correct and complete
 * @param {Object} point - point object
 * */
const completePoint = (point) => point && Number.isFinite(point.x) && Number.isFinite(point.y);

/*
 * Check if a line is complete
 * @param {Object} item - mark object
 * */
const completeFromTo = (item) => item && completeMark.point(item.from) && completeMark.point(item.to);

/*
 * Check if a point is correct and complete
 * @param {Object} item - mark object
 * */
const completePoints = (item) =>
  item &&
  item.points &&
  item.points.length &&
  (item.points.filter((point) => completePoint(point)) || []).length === item.points.length;

/*
 * Complete mark object for line and point
 * */
const completeMark = {
  point: completePoint,
  line: completeFromTo,
  polygon: completePoints,
};

/*
 * Function to remove invalid answers
 * @param {Array} answers - answers array
 * */
export const removeInvalidAnswers = (answers) =>
  answers
    ? (answers || []).filter(({ type, ...answer }) => (completeMark[type] ? completeMark[type](answer) : false))
    : [];
