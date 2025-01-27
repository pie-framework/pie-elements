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
  "prompt": "<div> <audio controls=\"\" controlslist=\"nodownload\"><source type=\"audio/mp4\" src=\"https://assets.pie-api.com/assets/b9cb01ba-8c9d-49bb-a67f-f5c3b0dfc85c/audio/m4a/107784c6-fa5f-4060-ac53-8938971e3da5\"></audio></div>",  promptEnabled: true,
  toolbarEditorPosition: 'bottom',
  rubricEnabled: false,
  autoplayAudioEnabled: true
});
