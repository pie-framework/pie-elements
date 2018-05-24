exports.model = (id, element) => ({
  id,
  element,
  feedback: {
    correct: {
      type: 'custom',
      custom: 'correct-o'
    },
    incorrect: {
      type: 'custom',
      custom: 'custom feedback'
    },
    partial: {
      type: 'custom',
      custom: 'foo'
    }
  },
  correctResponses: {
    values: ['mutt', 'hound'],
    ignoreWhitespace: true,
    ignoreCase: false
  },
  partialResponses: {
    values: ['mutty'],
    ignoreWhitespace: true,
    ignoreCase: true,
    awardPercentage: '50'
  },
  answerBlankSize: '10',
  answerAlignment: 'left',
  allowDecimal: true,
  allowIntegersOnly: false,
  allowThousandsSeparator: true
});
