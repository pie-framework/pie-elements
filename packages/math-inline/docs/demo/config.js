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
      "expression": "n = {\\embed{answerBlock}[answerBlock1]}",
      question: 'What is the equation for a slope?',
      equationEditor: 'everything',
      response: {},
      "responses": [
        {
          "answer": "n=-11",
          "id": "answerBlock1",
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
