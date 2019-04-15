exports.model = (id, element) => ({
  id,
  element,

  itemStem: 'Arrange the fruits alphabetically',
  choiceLabel: 'Choices',
  enableImages: false,
  targetLabel: 'Answers',
  placementArea: true,
  numberedGuides: false,
  orientation: 'vertical',
  removeTilesAfterPlacing: true,
  partialScoring: false,
  lockChoiceOrder: true,
  scoringType: 'auto',
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
  configure: {},
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
  }
});
