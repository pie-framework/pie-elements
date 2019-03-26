exports.model = (id, element) => ({
  id,
  element,
  feedback: { type: 'default', default: 'this is default feedback' },
  prompt: 'This is the question prompt',
  showMathInput: false
});
