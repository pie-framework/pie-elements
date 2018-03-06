module.exports = {
  elements: {
    'inline-choice': '../..'
  },
  models: [
    {
      id: '1',
      element: 'inline-choice',
      defaultLang: 'en-US',
      choiceLabel: 'Select option ...',
      prompt: 'Which of these northern European countries are EU members?',
      choices: [
        {
          correct: true,
          value: 'sweden',
          label: 'Sweden'
        },
        {
          value: 'iceland',
          label: 'Iceland',
          feedback: {
            type: 'default'
          }
        },
        {
          value: 'norway',
          label: 'Norway',
        },
        {
          value: 'finland',
          label: 'Finland',
          feedback: {
            type: 'custom',
            value: 'Finland joined the EU in 1995'
          }
        }
      ]
    }
  ]
}