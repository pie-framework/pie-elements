// Should be exactly the same as controller/defaults.js
export default {
  model: {
    markup: '',
    prompt: '',
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    rationale: 'Rationale goes here',
    rationaleEnabled: true,
    spellCheckEnabled: true,
    playerSpellCheckEnabled: true,
    responses: {},
    element: 'math-templated',
    equationEditor: '8',
  },
  configuration: {
    baseInputConfiguration: {
      html: { disabled: true },
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    prompt: {
      label: 'Prompt',
      settings: true,
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
    },
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    editSource: {
      label: 'Edit Source',
      settings: false,
      enabled: false,
    },
    playerSpellCheck: {
      label: 'Student Spellcheck',
      settings: true,
      enabled: true,
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
    },
    template: {
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    mathMlOptions: {
      mmlOutput: false,
      mmlEditing: false,
    },
    language: {
      settings: false,
      label: 'Specify Language',
      enabled: false,
    },
    languageChoices: {
      label: 'Language Choices',
      options: [],
    },
  },
};
