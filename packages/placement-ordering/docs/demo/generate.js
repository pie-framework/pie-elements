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
      label: 'Lemon',
      lockChoiceOrder: true,
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
  alternateResponses : [
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
  prompt: 'Arrange the fruits alphabetically',
  promptEnabled: true,
  lockChoiceOrder: false,
  numberedGuides: false,
  orientation: 'vertical',
  partialScoring: false,
  placementArea: false,
  scoringType: 'auto',
  targetLabel: 'Answers',
});
