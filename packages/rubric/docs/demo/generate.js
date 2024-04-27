exports.model = (id, element) => ({
  id,
  element,
  points: ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'],
  sampleAnswers: [null, 'just right', 'not left', null],
  maxPoints: 3,
  excludeZero: false,
});
