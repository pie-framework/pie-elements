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
  ],
  choiceAreaLayout: 'vertical',
  choiceAreaLabel: 'choices: ',
  showOrdering: true,
};
