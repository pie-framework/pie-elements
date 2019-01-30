exports.model = (id, element) => ({
  id,
  element,
  feedback: { type: 'default', default: 'this is default feedback' },
  width: '500px',
  prompt: 'This is the question prompt',
  showMathInput: false
});
