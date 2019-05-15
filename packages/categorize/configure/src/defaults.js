export default {
  model: {
    choices: [
      {
        id: '0',
        content: 'Choice 0'
      },
    ],
    choicesPerRow: 2,
    choicesPosition: 'below',
    choicesLabel: '',
    lockChoiceOrder: true,
    removeTilesAfterPlacing: false,
    categoriesPerRow: 2,
    categories: [
      {
        id: '0',
        label: 'Category 0',
        choices: []
      },
    ],
    correctResponse: [],
    partialScoring: true
  },
  configuration: {
    partialScoring: {
      settings: true,
      label: 'Allow Partial Scoring',
    },
    rationale: {
      settings: true,
      label: 'Rationale',
      enabled: false,
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
      enabled: true,
    },
    teacherInstructions: {
      settings: false,
      label: 'Teacher Instructions',
      enabled: true,
    },
  }
};
