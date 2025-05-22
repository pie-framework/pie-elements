export default {
  model: {
    choices: [],
    choicesPosition: 'below',
    correctResponse: {},
    disabled: false,
    duplicates: true,
    markup: '',
    mode: 'gather',
    prompt: '',
    promptEnabled: true,
    rationale: '',
    rationaleEnabled: true,
    studentInstructionsEnabled: true,
    teacherInstructions: '',
    teacherInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
      h3: { disabled: true },
      blockquote: { disabled: true },
      textAlign: { disabled: true },
      showParagraphs: { disabled: false },
      separateParagraphs: { disabled: true },
    },
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    choicesPosition: {
      settings: true,
      label: 'Choices Position',
    },
    prompt: {
      settings: true,
      label: 'Prompt',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
    },
    addChoice: {
      inputConfiguration: {
        audio: { disabled: true },
        video: { disabled: true },
        image: { disabled: false },
      },
    },
    duplicates: {
      settings: true,
      label: 'Duplicates',
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order',
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring',
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
    settingsPanelDisabled: false,
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
    minChoices: 2,
    maxResponseAreas: 10,
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
      choice: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
      choice: 300,
    },
    withRubric: {
      settings: false,
      label: 'Add Rubric',
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
    maxLength: 200
  },
};
