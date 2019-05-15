exports.model = (id, element) => ({
  id,
  element,
  choiceMode: 'checkbox',
  choicePrefix: 'numbers',
  choices: [
    {
      correct: true,
      value: 'sweden',
      label: 'Sweden',
      feedback: {
        type: 'none',
        value: ''
      },
    },
    {
      value: 'iceland',
      label: 'Iceland',
      feedback: {
        type: 'none',
        value: ''
      },
      rationale: 'Rationale for Iceland'
    },
    {
      value: 'norway',
      label: 'Norway',
      feedback: {
        type: 'none',
        value:
          ''
      },
      rationale: 'Rationale for Norway'
    },
    {
      correct: true,
      value: 'finland',
      label: 'Finland',
      feedback: {
        type: 'none',
        value: ''
      },
      rationale: 'Rationale for Finland'
    }
  ],
  prompt: 'Which of these northern European countries are EU members?',
});