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
    },
    settingsPanelDisabled: false,
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
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
      settings: true,
      label: 'Specify Language',
      enabled: false,
    },
    languageChoices: {
      label: 'Language Choices',
      options: [
        { value: 'en_US', label: 'English (US)' },
        { value: 'es_ES', label: 'Spanish' }
      ],
    }
  },
};
