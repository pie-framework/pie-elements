export default {
  model: {
    disabled: false,
    mode: 'gather',
    prompt: 'Use the inputs to complete the sentence',
    markup: '',
    choices: [],
    choicesPosition: 'below',
    correctResponse: {},
    duplicates: true,
    rationaleEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
  },
  configuration: {
    spellCheck: {
      label: "Spellcheck",
      settings: false,
      enabled:true
    },
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
    }
  }
};
