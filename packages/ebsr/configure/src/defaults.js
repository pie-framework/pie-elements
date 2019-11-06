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
  partialScoring: {
    settings: false,
    label: 'Allow Partial Scoring'
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
    label: 'Scoring Type'
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
  partialScoring: false,
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
    partA: partModel({ prompt: 'Prompt A' }),
    partB: partModel({ prompt: 'Prompt B' })
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
        label: 'Allow Partial Scoring'
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
