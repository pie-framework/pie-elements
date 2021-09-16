export default {
  model: {
    disabled: false,
    mode: 'gather',
    prompt: 'Use the dropdowns to complete the sentence',
    shuffle: true,
    markup: '',
    choices: {},
    alternateResponse: {},
    promptEnabled: true,
    rationaleEnabled: true,
    choiceRationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    lockChoiceOrder: {
      settings: true,
      label: 'Lock Choice Order'
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
    choiceRationale: {
      settings: true,
      label: 'Choice Rationale'
    }
  }
};
