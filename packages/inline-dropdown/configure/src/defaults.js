export default {
  model: {
    // !! configure src defaults models needs to have the same content as controller src defaults
    disabled: false,
    mode: 'gather',
    prompt: '',
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
    displayType: 'block'
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    spellCheck: {
      label: 'Spellcheck',
      settings:false,
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
    maxResponseAreas: 10,
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    }
  }
};
