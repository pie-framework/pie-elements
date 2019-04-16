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
  itemStem: 'Arrange the fruits alphabetically',
  lockChoiceOrder: true,
  numberedGuides: false,
  orientation: 'vertical',
  partialScoring: false,
  placementArea: true,
  removeTilesAfterPlacing: true,
  scoringType: 'auto',
  targetLabel: 'Answers',
  configure: {},
});
