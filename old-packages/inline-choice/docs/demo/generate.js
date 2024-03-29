exports.model = (id, element) => ({
  id,
  element,

  defaultLang: 'en-US',
  choiceLabel: 'Select option ...',
  choices: [
    {
      correct: true,
      value: 'sweden',
      label: 'Sweden',
    },
    {
      value: 'iceland',
      label: 'Iceland',
      feedback: {
        type: 'default',
      },
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
        value: 'Nokia was founded in Finland.',
      },
    },
  ],
});
