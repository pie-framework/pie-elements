export default {
  targetLabel: 'Target Label goes here',
  choiceLabel: 'Choice Label goes here',
  choicesOrientation: 'vertical',
  choices: [
    {
      id: 'c1',
      label: 'Choice 1',
    },
  ],
  configure: {
    labelItemStem: 'Item Stem',
    labelChoice: 'Choice label',
    labelTarget: 'Target label',
    labelPlacementArea: 'Placement Area',
    labelChoices: 'Choices',
    labelOrientation: 'Orientation',
    labelShuffle: 'Shuffle Choices',
    labelNumberedGuides: 'Numbered Guides',
    labelEnableImages: 'Enable Images',
    labelRemoveTiles: 'Remove tiles after placing',
    labelPartialScoring: 'Partial Scoring',

    // if item stem can be changed
    editableItemStem: true,
    // if placement area label can be changed
    editablePlacementAreaLabel: true,
    // if choices labels can be changed
    editableChoicesLabel: true,
    // if choice label can be changed
    editableChoiceLabel: false,
    // if tiles should remove after they are placed
    removeTileAfterPlacing: true,
    // if images are enabled
    imagesEnabled: false,

    // if choice label switch is displayed in settings panel
    settingsChoiceLabel: true,
    // if placement area switch is displayed in settings panel
    settingsPlacementArea: true,
    // if changing orientation will be displayed in settings panel
    settingsOrientation: true,
    // is shuffle choices switch will be displayed in settings panel
    settingsShuffle: true,
    // if numbered guides switch will be displayed in settings panel
    settingsNumberedGuides: true,
    // if enable images switch will be displayed in settings panel
    settingsEnableImages: true,
    // if remove tiles after placing switch will be displayed in settings panel
    settingsRemoveTileAfterPlacing: false,
    // if partial scoring switch will be displayed in settings panel
    settingsPartialScoring: true,
    // if feedback settings can be changed
    settingsFeedback: true,
  },
  correctResponse: [
    {
      id: 'c1',
    },
  ],
  itemStem: 'Item Stem goes here',
  placementArea: true,
  showOrdering: true,
  shuffle: false,
  partialScoring: false
};
