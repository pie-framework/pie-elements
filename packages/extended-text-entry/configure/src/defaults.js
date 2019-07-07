export default {
  model: {
    height: 100,
    prompt: 'This is the question prompt',
    mathInput: false,
    width: 500,
  },
  configuration: {
    equationEditor: {
      settings: false,
      label: 'Equation Editor',
      enabled: false,
    },
    feedback: {
      settings: true,
      label: 'Feedback',
      enabled: true
    },
    height: {
      settings: true,
      label: 'Height (px)',
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
    width: {
      settings: true,
      label: 'Width (px)',
    },
  }
};
