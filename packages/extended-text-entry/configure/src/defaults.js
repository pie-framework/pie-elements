export default {
  model: {
    dimensions: {
      height: 100,
      width: 500
    },
    prompt: 'This is the question prompt',
    mathInput: false,
    equationEditor: 'everything',
    feedbackEnabled: false,
    rationaleEnabled: false,
    promptEnabled: false,
    teacherInstructionsEnabled: false,
    studentInstructionsEnabled: false
  },
  configuration: {
    dimensions: {
      settings: true,
      label: 'Text-Entry Display Size'
    },
    equationEditor: {
      settings: false,
      label: 'Equation Editor',
      enabled: true,
    },
    feedback: {
      settings: true,
      label: 'Feedback'
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
      label: 'Student Instructions'
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
  }
};
