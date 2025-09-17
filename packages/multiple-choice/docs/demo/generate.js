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
    },
    {
      value: 'iceland',
      label: 'Iceland',
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Iceland',
    },
    {
      value: 'norway',
      label: 'Norway',
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Norway',
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
    `,
  },
  prompt: '',
  promptEnabled: true,
  toolbarEditorPosition: 'bottom',
  rubricEnabled: false,
  selectedAnswerStrokeColor: 'rgb(65, 65, 1)',
  selectedAnswerBackgroundColor: 'rgb(252,252,11)',
  selectedAnswerStrokeWidth: '1',
});
