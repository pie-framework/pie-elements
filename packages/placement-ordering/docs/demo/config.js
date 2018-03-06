module.exports = {
  elements: {
    'placement-ordering': '../..'
  },
  models: [
    {
      id: '1',
      element: 'placement-ordering',
      correctResponse: [
        {
          id: 'c1',
          weight: 0.2
        },
        {
          id: 'c4',
          weight: 0.2
        },
        {
          id: 'c3',
          weight: 0.3
        },
        {
          id: 'c2',
          weight: 0.3
        }
      ],
      model: {
        prompt: 'Arrange the fruits alphabetically',
        choices: [
          {
            id: 'c2',
            label: 'Lemon',
            shuffle: false,
            moveOnDrag: true
          },
          {
            id: 'c3',
            label: 'Melon',
            moveOnDrag: true
          },
          {
            id: 'c1',
            label: 'Blueberry',
            moveOnDrag: false
          },
          {
            id: 'c4',
            label: 'Pear',
            moveOnDrag: false
          }
        ]
      },
      config: {
        shuffle: false,
        placementType: 'none',
        choiceAreaLayout: 'vertical',
        choiceAreaLabel: 'choices: ',
        answerAreaLabel: 'Answer Area Label',
        showOrdering: true
      },
      feedback: {
        correctFeedbackType: 'custom',
        correctFeedback: 'foo',
        incorrectFeedbackType: 'custom',
        incorrectFeedback: 'foo',
        partialFeedbackType: 'custom',
        partialFeedback: 'foo',
      }
    }
  ]
}