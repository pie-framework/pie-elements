export default {
  model: {
    correctResponses: {
      values: ['correct response'],
      ignoreWhitespace: false,
      ignoreCase: false
    },
    partialResponses: {
      values: ['partial response'],
      ignoreWhitespace: false,
      ignoreCase: false,
      awardPercentage: '50'
    },
    answerBlankSize: '10',
    answerAlignment: 'left',
    prompt: 'Question Prompt goes here',
    allowDecimal: false,
    allowThousandsSeparator: false
  },
  configuration: {}
};
