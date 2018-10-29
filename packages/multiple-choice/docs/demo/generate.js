exports.model = (id, element) => ({
  id,
  element,
  prompt: 'Which of these northern European countries are EU members?',
  choiceMode: 'checkbox',
  keyMode: 'numbers',
  choices: [
    {
      correct: true,
      value: 'sweden',
      label: 'Sweden',
      feedback: {
        type: 'none',
        value: ''
      }
    },
    {
      value: 'iceland',
      label: 'Iceland',
      feedback: {
        type: 'none',
        value: ''
      }
    },
    {
      value: 'norway',
      label: 'Norway',
      feedback: {
        type: 'none',
        value:
          ''
      }
    },
    {
      correct: true,
      value: 'finland',
      label: 'Finland',
      feedback: {
        type: 'none',
        value: ''
      }
    }
  ],
  partialScoring: false,
  partialScoringLabel: `Each correct response that is correctly checked and each incorrect response
          that is correctly unchecked will be worth 1 point.
          The maximum points is the total number of answer choices.`
});
