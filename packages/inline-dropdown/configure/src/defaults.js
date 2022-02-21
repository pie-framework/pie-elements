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
    studentInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
    spellCheckEnabled:false,
    displayType: 'block'
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    spellCheck: {
      label: "Spellcheck",
      settings:true,
      enabled:true
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
    },
    toolbarEditorPosition:{
      settings: false,
      label: 'Toolbar Editor Position'
    },
  }
};
