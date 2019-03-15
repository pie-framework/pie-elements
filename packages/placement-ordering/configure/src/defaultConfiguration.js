export default {
  configure: {
    orientationLabel: 'Orientation',
    shuffleLabel: 'Highlight choices',
    includePlacementAreaLabel: 'Include placement area',
    numberedGuidesLabel: 'Numbered guides',
    promptLabel: 'Prompt',
    choiceLabel: 'Choice label',
    choicesLabel: 'Choices',
    removeTilesLabel: 'Remove all tiles after placing',
    enableOrientationChange: true,
    enableShuffleChange: true,
    enablePlacementAreaChange: true,
    enableNumberedGuideChange: true,
    enablePromptChange: true,
    enableChoiceLabelChange: true,
    enableChoicesLabelChange: true,
    enableRemoveTiles: true,
    enableFeedback: true,
  },
  correctResponse: [
    {
      id: 'c1',
    },
  ],
  prompt: 'Question Prompt goes here',
  choices: [
    {
      id: 'c1',
      label: 'Choice 1',
    },
  ],
  choiceAreaLayout: 'vertical',
  choiceAreaLabel: 'Choice Label goes here',
  showOrdering: true,
  shuffle: false
};
