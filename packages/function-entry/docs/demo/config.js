module.exports = {
  elements: {
    'function-entry': '../..'
  },
  models: [
    {
      id: '1',
      element: 'function-entry',
      weight: 1,
      incorrectFeedback: {
        type: 'default',
      },
      correctResponse: {
        equation: '3x+2',
        feedback: {
          type: 'default',
        },
      },
      model: {
        showFormattingHelp: true
      }
    }
  ]
};
