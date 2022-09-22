export default {
  model: {
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
  },
  configuration: {
    spellCheck: {
      label: 'Spellcheck',
      settings:false,
      enabled:true
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
    maxImageWidth: {
      teacherInstructions: 300
    },
    maxImageHeight: {
      teacherInstructions: 300
    }
  }
};
