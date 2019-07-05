export default {
  model: {
    dimensions: {
      height: 100,
      width: 500
    },
    prompt: 'This is the question prompt',
    mathInput: false,
  },
  configuration: {
    dimensions: {
      settings: true,
      label: 'Text-Entry Display Size'
    },
    equationEditor: {
      settings: false,
      label: 'Equation Editor',
      enabled: false,
    },
    mathInput: {
      settings: true,
      label: 'Student response can include math notation',
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
      enabled: true,
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
      enabled: true,
    },
  }
};
