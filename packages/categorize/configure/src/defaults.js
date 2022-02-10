export default {
  model: {
    choices: [],
    choicesPosition: 'below',
    choicesLabel: '',
    lockChoiceOrder: true,
    removeTilesAfterPlacing: false,
    categoriesPerRow: 2,
    categories: [],
    alternates: [],
    correctResponse: [],
    rowLabels: [''],
    partialScoring: true,
    feedbackEnabled: true,
    rationaleEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
    spellCheckEnabled:false
  },
  configuration: {
    spellCheck: {
      label: "Spellcheck",
      settings:true,
      enabled:true
    },
    feedback: {
      settings: true,
      label: 'Feedback',
      enabled: true
    },
    lockChoiceOrder: {
      settings: false,
      label: 'Lock Choice Order'
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring',
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions'
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
    toolbarEditorPosition:{
      settings: false,
      label: 'Toolbar Editor Position'
    },
  }
};
