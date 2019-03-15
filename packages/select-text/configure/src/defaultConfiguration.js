const tokens = () => [
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    start: 0,
    end: 55,
  },
];

export default {
  highlightChoices: false,
  partialScoring: false,
  maxSelections: 2,
  mode: 'sentence',
  prompt: 'Question Prompt goes here',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  tokens: tokens(),
  configure: {
    contentLabel: 'Content',
    highlightChoicesLabel: 'Highlight choices',
    tokensLabel: 'Tokens',
    setCorrectAnswersLabel: 'Set correct answers',
    modeLabel: 'Mode',
    availableSelectionsLabel: 'Selections Available',
    correctAnswersLabel: 'Correct Answers',
    selectionCountLabel: 'Selection count',
    enableContentChange: true,
    enableHighlightChoices: true,
    enableTokensChange: true,
    showMode: true,
    showSelections: true,
    showCorrectAnswersNumber: true,
    showSelectionCount: true,
    enableFeedback: true
  }
};
