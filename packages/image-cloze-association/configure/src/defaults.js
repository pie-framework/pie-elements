export default {
  model: {
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
  },
  configuration: {
    maxImageWidth: {
      teacherInstructions: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
    },
    settingsPanelDisabled: false,
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
    },
    withRubric: {
      settings: false,
      label: 'Add Rubric',
    },
  },
};
