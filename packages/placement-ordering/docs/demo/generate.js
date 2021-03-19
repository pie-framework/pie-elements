exports.model = (id, element) => ({
  id,
  element,
  choiceLabel: 'Choices',
  choices: [
    {
      id: 'c1',
      label: 'Blueberry',
    },
    {
      id: 'c2',
      label: 'Lemon'
    },
    {
      id: 'c3',
      label: 'Melon',
    },
    {
      id: 'c4',
      label: 'Pear',
    },
  ],
  correctResponse: ['c1', 'c2', 'c3', 'c4'],
  alternateResponses: [
    ['c4', 'c3', 'c2', 'c1']
  ],
  enableImages: false,
  feedback: {
    correct: {
      type: 'custom',
      custom: 'foo'
    },
    incorrect: {
      type: 'custom',
      custom: 'no'
    },
    partial: {
      type: 'custom',
      custom: 'nearly'
    }
  },
  feedbackEnabled: true,
  prompt: 'Arrange the fruits alphabetically',
  promptEnabled: true,
  lockChoiceOrder: false,
  numberedGuides: false,
  orientation: 'vertical',
  partialScoring: false,
  placementArea: true,
  scoringType: 'auto',
  targetLabel: 'Answers',
});
