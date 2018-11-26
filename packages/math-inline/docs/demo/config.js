module.exports = {
  elements: {
    'math-inline': '../..'
  },
  models: [
    {
      id: '1',
      element: 'math-inline',
      feedback: {
        correct: {
          type: 'none',
          default: 'Correct'
        },
        partial: {
          type: 'none',
          default: 'Nearly'
        },
        incorrect: {
          type: 'none',
          default: 'Incorrect'
        }
      },
    }
  ]
};
