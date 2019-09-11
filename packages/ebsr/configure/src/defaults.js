import cloneDeep from 'lodash/cloneDeep';

const defaultConfig = {
  choiceMode: {
    settings: true,
    label: 'Response Type'
  },
  addChoiceButton: {
    settings: true,
    label: 'Add a Choice',
  },
  choicePrefix: {
    settings: true,
    label: 'Choice Labels'
  },
  deleteChoice: {
    settings: true,
  },
  feedback: {
    settings: true,
    label: 'Feedback',
    enabled: true
  },
  prompt: {
    settings: true,
    label: 'Prompt'
  },
  lockChoiceOrder: {
    settings: true,
    label: 'Lock Choice Order'
  },
  partialScoring: {
    settings: true,
    label: 'Allow Partial Scoring',
  },
  rationale: {
    settings: true,
    label: 'Rationale',
    enabled: true,
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
    settings: true,
    label: 'Teacher Instructions',
    enabled: true,
  },
  sequentialChoiceLabels: {
    settings: false,
    label: 'Sequential Choice Labels',
    enabled: false
  }
};

export default {
  model: {
    partLabels: true,
    partLabelType: 'Letters',
    partA: {
      choices: [],
      prompt: 'Prompt A',
      choicePrefix: 'numbers'
    },
    partB: {
      choices: [],
      prompt: 'Prompt B',
      choicePrefix: 'numbers'
    },
  },
  configuration: {
    partA: {
      ...cloneDeep(defaultConfig),
      choiceMode: {
        settings: false,
        label: 'Response Type'
      },
      partialScoring: {
        settings: false,
        label: 'Allow Partial Scoring',
      }
    },
    partB: cloneDeep(defaultConfig),
    partLabels: {
      settings: true,
      label: 'Part Labels'
    },
    settingsPanelDisabled: true
  }
};
