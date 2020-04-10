exports.model = (id, element) => ({
  id,
  element,
  showFormattingHelp: true,
  equation: '3x+2',
  feedback: {
    correct: {
      type: 'default',
      default: 'Correct'
    },
    incorrect: {
      type: 'default',
      default: 'Incorrect'
    }
  }
});
