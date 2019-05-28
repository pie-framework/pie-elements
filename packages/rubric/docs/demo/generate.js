exports.model = (id, element) => ({
  id,
  element,
  points: ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'],
  maxPoints: 4,
  excludeZero: true
});
