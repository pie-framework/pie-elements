export default {
  model: {
    prompt: 'This is the question prompt',
    imageUrl: '',
    imageDimensions: {
      height: 0,
      width: 0,
    },
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    backgroundImageEnabled: true,
    spellCheckEnabled: true,
    toolbarEditorPosition: 'bottom',
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    backgroundImage: {
      settings: true,
      label: 'Background Image',
    },
    prompt: {
      settings: true,
      label: 'Prompt',
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
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
    },
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
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
  },
};
