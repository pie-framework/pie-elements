export default {
  model: {
    // !! configure src defaults models needs to have the same content as controller src defaults
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
