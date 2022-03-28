export default {
  model: {
    dimensions: {
      height: 100,
      width: 500
    },
    prompt: 'This is the question prompt',
    mathInput: false,
    equationEditor: 'Grade 8 - HS',
    feedbackEnabled: true,
    rationaleEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    spellCheckEnabled:true,
    playerSpellCheckEnabled:true,
    toolbarEditorPosition: 'bottom'
  },
  configuration: {
    dimensions: {
      settings: true,
      label: 'Text-Entry Display Size'
    },
    spellCheck: {
      label: 'Spellcheck',
      settings:false,
      enabled:true
    },
    playerSpellCheck: {
      label: 'Student Spellcheck',
      settings:true,
      enabled:true
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
