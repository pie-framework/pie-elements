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
      expression: '1+1',
      question: 'What is the equation for a slope?',
      equationEditor: 'simple',
      defaultResponse: {
        id: 0,
        validation: 'symbolic',
        answer: 'y = mx + b',
        alternates: {},
        allowSpaces: true,
        allowDecimals: true
      },
      responses: [{
        id: 'answerBlock1',
        validation: 'symbolic',
        answer: 'y = mx + b',
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
