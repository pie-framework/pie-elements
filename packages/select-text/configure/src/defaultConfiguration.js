const tokens = () => [
  {
    text: 'Rachel cut out 8 stars in 6 minutes.',
    start: 0,
    end: 36,
    correct: true
  },
  {
    text: 'Lovelle cut out 6 stars in 4 minutes.',
    start: 37,
    end: 74,
    correct: true
  },
  {
    text: 'Lovelle and Rachel cut the same number of stars in 6 minutes.',
    start: 117,
    end: 177
  }
];

export default {
  highlightChoices: true,
  partialScoring: false,
  maxSelections: 2,
  mode: 'sentence',
  prompt: 'What sentences contain the character 6 in them?',
  text:
    'Rachel cut out 8 stars in 6 minutes. Lovelle cut out 6 stars in 4 minutes. Rachel cut out 4 more stars than Lovelle. Lovelle and Rachel cut the same number of stars in 6 minutes.',
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
