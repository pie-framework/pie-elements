export default {
  model: {
    // !! configure src defaults models needs to have the same content as controller src defaults
    disabled: false,
    mode: 'gather',
    prompt: '',
    shuffle: true,
    markup: '',
    toolbarEditorPosition: 'bottom',
    displayType: 'block',
    spellCheckEnabled:true,
    playerSpellCheckEnabled:true,
    choices: {},
    maxLengthPerChoiceEnabled: true,
    rationaleEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt'
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring'
    },
    rationale: {
      settings: true,
      label: 'Rationale'
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
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions'
    },
    maxLengthPerChoice: {
      settings: true,
      label: 'Maximum Length Per Choice'
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
