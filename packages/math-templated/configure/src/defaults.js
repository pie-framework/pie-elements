// Should be exactly the same as controller/defaults.js
export default {
  model: {
    allowTrailingZerosDefault: false,
    equationEditor: '8',
    ignoreOrderDefault: false,
    markup: '',
    playerSpellCheckEnabled: true,
    prompt: '',
    promptEnabled: true,
    rationale: '',
    rationaleEnabled: true,
    responses: {},
    spellCheckEnabled: true,
    teacherInstructions: '',
    teacherInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
    validationDefault: 'literal',
  },
  configuration: {
    ignoreOrder: {
      settings: false,
      label: 'Ignore Order',
      enabled: true,
    },
    allowTrailingZeros: {
      settings: false,
      label: 'Allow Trailing Zeros',
      enabled: true,
    },
    partialScoring: {
      settings: true,
      label: 'Allow Partial Scoring',
    },
    baseInputConfiguration: {
      html: { disabled: true },
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
      h3: { disabled: true },
      blockquote: { disabled: true },
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
    maxResponseAreas: 10,
  },
};
