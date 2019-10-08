export default {
  model: {
    disabled: false,
    mode: 'gather',
    prompt: 'Use the inputs to complete the sentence',
    shuffle: true,
    markup: '',
    choices: [],
    choicesPosition: 'below',
    correctResponse: {},
    duplicates: true,
    rationaleEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true
  },
  configuration: {
    choicesPosition: {
      settings: true,
      label: 'Choices Position'
    },
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    duplicates: {
      settings: true,
      label: 'Duplicates'
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order'
    },
    partialScoring: {
      settings: true,
      label: 'Allow Partial Scoring'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    }
  }
};
