exports.model = (id, element) => ({
  id,
  element,
  mode: 'advanced',
  config: {
    allowPartialScores: false
  },
  expression: 'y = ',
  question: 'What is the equation for a slope?',
  equationEditor: 'simple',
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
});
