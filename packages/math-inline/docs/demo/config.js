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
      "expression": "n = {\\embed{answerBlock}[answerBlock2]}",
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
      "responses": [
        {
          "answer": "n=-11",
          "id": "answerBlock2",
          "alternates": {},
          "validation": "literal"
        }
      ],
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
