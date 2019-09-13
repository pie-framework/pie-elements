import cloneDeep from 'lodash/cloneDeep';

const defaultConfig = {
  addChoiceButton: {
    settings: true,
    label: 'Add a Choice',
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
    settings: true,
  },
  feedback: {
    settings: true,
    label: 'Feedback',
    enabled: true
  },
  lockChoiceOrder: {
    settings: true,
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
    label: 'Rationale',
    enabled: true,
  },
  scoringType: {
    settings: false,
    label: 'Scoring Type',
  },
  sequentialChoiceLabels: {
    settings: false,
    label: 'Sequential Choice Labels',
    enabled: false
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
  }
};

export default {
  model: {
    partLabels: true,
    partLabelType: 'Letters',
    partA: {
      choiceMode: 'radio',
      choices: [],
      choicePrefix: 'numbers',
      partialScoring: false,
      prompt: 'Prompt A',
    },
    partB: {
      choiceMode: 'radio',
      choices: [],
      choicePrefix: 'numbers',
      partialScoring: false,
      prompt: 'Prompt B',
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
