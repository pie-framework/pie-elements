export default {
  mode: 'advanced',
  expression: 'y = ',
  question: 'What is the equation for a slope?',
  equationEditor: 'everything',
  response: {
    id: 'answerBlock1',
    answer: 'mx + b',
    validation: 'symbolic',
    alternates: {},
    allowSpaces: true,
    allowDecimals: true
  },
  responses: [],
  partialScoring: true,
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
};
