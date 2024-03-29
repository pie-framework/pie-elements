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
        value: '',
      },
      accessibility: 'sweden',
    },
    {
      value: 'iceland',
      label: 'Iceland',
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Iceland',
      accessibility: 'iceland',
    },
    {
      value: 'norway',
      label: 'Norway',
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Norway',
      accessibility: 'norway',
    },
    {
      correct: true,
      value: 'finland',
      label: 'Finland',
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Finland',
      accessibility: 'finland',
    },
  ],
  prompt: "",
  promptEnabled: true,
  toolbarEditorPosition: 'bottom',
  rubricEnabled: false,
});
