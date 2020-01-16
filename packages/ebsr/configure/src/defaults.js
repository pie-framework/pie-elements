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
  }
};

const partModel = base => ({
  choiceMode: 'radio',
  choices: [],
  choicePrefix: 'numbers',
  prompt: 'Prompt',
  rationaleEnabled: true,
  feedbackEnabled: true,
  promptEnabled: true,
  teacherInstructions: '',
  rationale: '',
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...base
});

export default {
  model: {
    partLabels: true,
    partLabelType: 'Letters',
    partialScoring: false,
    partA: partModel({ prompt: 'Prompt A' }),
    partB: partModel({ prompt: 'Prompt B' })
  },
  configuration: {
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring'
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type'
    },
    partA: {
      ...cloneDeep(defaultConfig),
      choiceMode: {
        settings: false,
        label: 'Response Type'
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
