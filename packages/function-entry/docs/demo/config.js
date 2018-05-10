module.exports = {
  elements: {
    'function-entry': '../..'
  },
  models: [
    {
      id: '1',
      element: 'function-entry',
      weight: 1,
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
    }
  ]
};
