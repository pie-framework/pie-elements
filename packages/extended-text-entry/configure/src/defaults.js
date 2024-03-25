export default {
  model: {
    dimensions: {
      height: 100,
      width: 500,
    },
    prompt: 'This is the question prompt',
    mathInput: false,
    spanishInput: false,
    specialInput: false,
    equationEditor: 'Grade 8 - HS',
    feedbackEnabled: false,
    rationaleEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    spellCheckEnabled: true,
    playerSpellCheckDisabled: true,
    toolbarEditorPosition: 'bottom',
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    dimensions: {
      settings: true,
      label: 'Text-Entry Display Size',
    },
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    playerSpellCheck: {
      label: 'Disable Student Spellcheck',
      settings: true,
      enabled: true,
    },
    equationEditor: {
      settings: false,
      label: 'Equation Editor',
      enabled: true,
    },
    feedback: {
      settings: true,
      label: 'Feedback',
    },
    mathInput: {
      settings: true,
      label: 'Student response can include math notation',
      enabled: false,
    },
    settingsPanelDisabled: false,
    spanishInput: {
      settings: true,
      label: 'Students can insert Spanish',
      enabled: false,
    },
    specialInput: {
      settings: true,
      label: 'Students can insert Special Characters',
      enabled: false,
    },
    multiple: {
      settings: false,
      label: 'Multiple Parts',
      enabled: false,
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
    },
    prompt: {
      settings: true,
      label: 'Prompt',
      required: false,
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
      required: false,
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
  },
};
