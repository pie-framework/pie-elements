export default {
  answerAreaLabel: 'Answer Label goes here',
  choiceAreaLabel: 'Choice Label goes here',
  choiceAreaLayout: 'vertical',
  choices: [
    {
      id: 'c1',
      label: 'Choice 1',
    },
  ],
  configure: {
    itemStemLabel: 'Item Stem',
    choiceLabel: 'Choice label',
    answerLabel: 'Answer label',
    placementAreaLabel: 'Placement Area',
    choicesLabel: 'Choices',
    orientationLabel: 'Orientation',
    shuffleLabel: 'Shuffle Choices',
    numberedGuidesLabel: 'Numbered Guides',
    enableImagesLabel: 'Enable Images',
    removeTilesLabel: 'Remove tiles after placing',
    partialScoringLabel: 'Partial Scoring',

    // if item stem can be changed
    settingsItemStemChange: true,
    // if choice label switch is displayed in settings panel
    settingsChoiceLabel: true,
    // if placement area label can be changed
    settingsPlacementAreaLabel: true,
    // if placement area switch is displayed in settings panel
    settingsPlacementArea: true,
    // if choices labels can be changed
    settingsChoicesLabel: true,
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

    // if choice label can be changed
    editableChoiceLabel: false,
    // if tiles should remove after they are placed
    removeTileAfterPlacing: true,
    // if images are enabled
    imagesEnabled: false
  },
  correctResponse: [
    {
      id: 'c1',
    },
  ],
  itemStem: 'Question Prompt goes here',
  placementArea: true,
  showOrdering: true,
  shuffle: false,
};
