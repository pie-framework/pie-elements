const completePoint = point => (point && Number.isFinite(point.x) && Number.isFinite(point.y));
const completeFromTo = item => item && completeMark.point(item.from) && completeMark.point(item.to);
const completeRootEdge = item => item && completeMark.point(item.edge) && completeMark.point(item.root);
const completePoints = item => item && item.points && item.points.length &&
  (item.points.filter(point => completePoint(point)) || []).length === item.points.length;

const completeMark = {
  point: completePoint,
  line: completeFromTo,
  ray: completeFromTo,
  segment: completeFromTo,
  vector: completeFromTo,
  circle: completeRootEdge,
  parabola: completeRootEdge,
  sine: completeRootEdge,
  polygon: completePoints,
};

export const removeInvalidAnswers = answers => answers
  ? (answers || []).filter(({ type, ...answer}) => completeMark[type] ? completeMark[type](answer) : false)
  : [];
