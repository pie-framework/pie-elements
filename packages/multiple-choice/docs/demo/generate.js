exports.model = (id, element) => ({
  id,
  element,
  choiceMode: 'checkbox',
  choicePrefix: 'numbers',
  selectionButtonPosition: 'below',
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
  extraCSSRules: {
    names: ['red', 'blue'],
    rules: `
      .red {
        color: red !important;
      }

      .blue {
        color: blue !important;
      }
    `
  },
  prompt: '',
  promptEnabled: true,
  toolbarEditorPosition: 'bottom',
  rubricEnabled: false,
});
