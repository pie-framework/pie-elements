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

const base = extras =>
  Object.assign(
    {},
    {
      highlightChoices: true,
      feedback: {
        correct: {
          type: 'default',
          default: 'Correct'
        },
        incorrect: {
          type: 'default',
          default: 'Incorrect'
        },
        partial: {
          type: 'default',
          default: 'Nearly'
        }
      },
      partialScoring: false,
      maxSelections: 2,
      mode: 'sentence',
      prompt: 'What sentences contain the character 6 in them?',
      text:
        'Rachel cut out 8 stars in 6 minutes. Lovelle cut out 6 stars in 4 minutes. Rachel cut out 4 more stars than Lovelle. Lovelle and Rachel cut the same number of stars in 6 minutes.',
      tokens: tokens(),
      configure: {
        /**
         * These are the configurable options
         */
        /*
        promptLabel: 'Item Stem',
        contentLabel : 'Contents',
        highlightChoicesLabel: 'Type of Answer',
        tokensLabel: 'Tokens',
        setCorrectAnswersLabel: 'Set correct answers',
        modeLabel: '',
        availableSelectionsLabel: '',
        correctAnswersLabel: '',
        selectionCountLabel: '',
        enableContentChange: false,
        enableHighlightChoices: false,
        enableTokensChange: false,
        showMode: false,
        showSelections: false,
        showCorrectAnswersNumber: false,
        showSelectionCount: false,
        enableFeedback: false*/
      }
    },
    extras
  );

exports.model = (id, element) => {
  return Object.assign({}, { id, element }, base({}));
};
