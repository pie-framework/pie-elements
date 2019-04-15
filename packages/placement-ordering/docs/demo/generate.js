exports.model = (id, element) => ({
  id,
  element,
  itemStem: 'Arrange the fruits alphabetically',
  choices: [
    {
      id: 'c1',
      label: 'Blueberry',
    },
    {
      id: 'c2',
      label: 'Lemon',
      shuffle: false,
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
  shuffle: false,
  placementArea: true,
  choicesOrientation: 'horizontal',
  choiceLabel: 'Choices',
  targetLabel: 'Answers',
  showOrdering: true,
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
  configure: {
    /**
     * These are the configurable options
     */
    // editableItemStem: false,
    // editablePlacementAreaLabel: false,
    // editableChoicesLabel: true,
    // editableChoiceLabel: true,
    // removeTileAfterPlacing: false,
    // imagesEnabled: true,
  },
  partialScoring: false,
  numberedGuides: false,
});