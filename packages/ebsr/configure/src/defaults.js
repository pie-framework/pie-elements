import cloneDeep from 'lodash/cloneDeep';

const defaultConfig = {
  addChoiceButton: {
    settings: true,
    label: 'Add a Choice'
  },
  choiceMode: {
    settings: true,
    label: 'Response Type'
  },
  choicePrefix: {
    settings: true,
    label: 'Choice Labels'
  },
  deleteChoice: {
    settings: true
  },
  feedback: {
    settings: true,
    label: 'Feedback'
  },
  lockChoiceOrder: {
    settings: true,
    label: 'Lock Choice Order'
  },
  prompt: {
    settings: true,
    label: 'Prompt'
  },
  rationale: {
    settings: true,
    label: 'Rationale'
  },
  studentInstructions: {
    settings: false,
    label: 'Student Instructions'
  },
  teacherInstructions: {
    settings: true,
    label: 'Teacher Instructions'
  },
  choicesLayout: {
    settings: false,
    label: 'Choices Layout',
  },
  gridColumns: {
    label: 'Grid columns',
  },
  spellCheck: {
    label: 'Spellcheck',
    settings:false,
    enabled:true
  },
  maxImageWidth: {
    teacherInstructions: 300,
    prompt: 300,
    rationale: 636,
    choices: 636
  },
  maxImageHeight: {
    teacherInstructions: 300,
    prompt: 300,
    rationale: 300,
    choices: 300
  }
};

const partModel = base => ({
  choiceMode: 'radio',
  choices: [],
  choicePrefix: 'numbers',
  prompt: '',
  rationaleEnabled: true,
  feedbackEnabled: true,
  promptEnabled: true,
  teacherInstructions: '',
  rationale: '',
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  spellCheckEnabled:true,
  choicesLayout: 'vertical',
  gridColumns: '2',
  ...base
});

export default {
  // !! configure src defaults models needs to have the same content as controller src defaults
  model: {
    partLabels: true,
    partLabelType: 'Letters',
    partialScoring: false,
    partA: partModel({ prompt: '' }),
    partB: partModel({ prompt: '' })
  },
  configuration: {
    partialScoring: {
      label: 'Allow Partial Scoring',
      // this will turn off partial scoring toggle in the settings tab by default for the interaction
      // as we'd like partial scoring to be controlled from the environment entirely
      // if any other consumers would like to enable it for themselves, they can do so from their model directly.
      settings: false
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type'
    },
    partA: cloneDeep(defaultConfig),
    partB: cloneDeep(defaultConfig),
    partLabels: {
      settings: true,
      label: 'Part Labels'
    },
    settingsPanelDisabled: true
  }
};
