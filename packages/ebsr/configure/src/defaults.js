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
    label: 'Feedback'
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
    label: 'Rationale'
  },
  scoringType: {
    settings: false,
    label: 'Scoring Type',
  },
  studentInstructions: {
    settings: false,
    label: 'Student Instructions'
  },
  teacherInstructions: {
    settings: true,
    label: 'Teacher Instructions'
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
      rationaleEnabled: true,
      feedbackEnabled: true,
      promptEnabled: true,
      teacherInstructions: 'test',
      rationale: 'test',
      teacherInstructionsEnabled: true,
      studentInstructionsEnabled: true
    },
    partB: {
      choiceMode: 'radio',
      choices: [],
      choicePrefix: 'numbers',
      partialScoring: false,
      prompt: 'Prompt B',
      rationaleEnabled: true,
      promptEnabled: true,
      feedbackEnabled: true,
      teacherInstructionsEnabled: true,
      studentInstructionsEnabled: true
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
