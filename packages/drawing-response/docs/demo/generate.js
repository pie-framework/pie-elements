exports.model = (id, element) => ({
  id,
  element,
  prompt: 'This is the question prompt',
  imageUrl: '',
  draws: [],
  textEntries: [],
  shapes: [],
  lines: [],
  multipleCorrect: true,
  partialScoring: false,
  dimensions: {
    height: 0,
    width: 0
  }
});
