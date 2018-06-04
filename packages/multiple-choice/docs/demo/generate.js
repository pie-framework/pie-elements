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
        type: 'custom',
        value: 'Sweden joined in 1995'
      }
    },
    {
      value: 'iceland',
      label: 'Iceland',
      feedback: {
        type: 'custom',
        value: 'Iceland is not an EU member state'
      }
    },
    {
      value: 'norway',
      label: 'Norway',
      feedback: {
        type: 'custom',
        value:
          'Norway is not an EU member, but they are a member for the Single Market'
      }
    },
    {
      correct: true,
      value: 'finland',
      label: 'Finland',
      feedback: {
        type: 'custom',
        value: 'Finland joined the EU in 1995'
      }
    }
  ],
  partialScoring: [{ numberOfCorrect: 1, scorePercentage: 20 }]
});
