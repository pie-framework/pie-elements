module.exports = {
  elements: {
    'math-inline': '../..'
  },
  models: [
    {
      id: '1',
      mode: 'advanced',
      config: {
        allowPartialScores: false
      },
      element: 'math-inline',
      expression: 'y = ',
      question: 'What is the equation for a slope?',
      equationEditor: 'everything',
      defaultResponse: {
        id: 0,
        validation: 'symbolic',
        answer: 'mx + b',
        alternates: {},
        allowSpaces: true,
        allowDecimals: true
      },
      responses: [{
        id: 'answerBlock1',
        validation: 'symbolic',
        answer: 'mx + b',
        alternates: {},
        allowSpaces: true,
        allowDecimals: true
      }],
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
