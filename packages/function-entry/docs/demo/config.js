module.exports = {

  elements: {
    'function-entry': '../..'
  },
  models: [
    {
      id: '1',
      element: 'function-entry',
      weight: 1,
      feedback: {
        correctFeedbackType: 'default',
        incorrectFeedbackType: 'default'
      },
      correctResponse: {
        equation: '3x+2',
      },
      model: {
        ignoreSpacing: true,
        showFormattingHelp: true
      }
    }
  ]
}
