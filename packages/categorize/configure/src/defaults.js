export default {
  model: {
    choices: [],
    choicesPerRow: 2,
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
    rationaleEnabled: true,
    promptEnabled: false,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true
  },
  configuration: {
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
      settings: true,
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
  }
};
