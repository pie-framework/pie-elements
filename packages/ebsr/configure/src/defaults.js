import cloneDeep from 'lodash/cloneDeep';

const defaultConfig = {
  addChoiceButton: {
    settings: true,
    label: 'Add a Choice',
  },
  choiceMode: {
    settings: true,
    label: 'Response Type',
  },
  choicePrefix: {
    settings: true,
    label: 'Choice Labels',
  },
  deleteChoice: {
    settings: true,
  },
  feedback: {
    settings: true,
    label: 'Feedback',
  },
  lockChoiceOrder: {
    settings: true,
    label: 'Lock Choice Order',
  },
  prompt: {
    settings: true,
    label: 'Prompt',
    inputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    required: false,
  },
  rationale: {
    settings: true,
    label: 'Rationale',
    inputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    required: false,
  },
  settingsPanelDisabled: true,
  studentInstructions: {
    settings: false,
    label: 'Student Instructions',
  },
  teacherInstructions: {
    settings: true,
    label: 'Teacher Instructions',
    inputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    required: false,
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
    settings: false,
    enabled: true,
  },
  maxImageWidth: {
    teacherInstructions: 300,
    prompt: 300,
    rationale: 636,
    choices: 636,
  },
  maxImageHeight: {
    teacherInstructions: 300,
    prompt: 300,
    rationale: 300,
    choices: 300,
  },
  mathMlOptions: {
    mmlOutput: false,
    mmlEditing: false,
  },
  choices: {
    inputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
  },
  baseInputConfiguration: {
    audio: { disabled: false },
    video: { disabled: false },
    image: { disabled: false },
  },
};

const partModel = (base) => ({
  choiceMode: 'radio',
  choicePrefix: 'numbers',
  choices: [],
  choicesLayout: 'vertical',
  feedbackEnabled: false,
  gridColumns: 2,
  prompt: '',
  promptEnabled: true,
  rationale: '',
  rationaleEnabled: true,
  spellCheckEnabled: true,
  studentInstructionsEnabled: true,
  teacherInstructions: '',
  teacherInstructionsEnabled: true,
  toolbarEditorPosition: 'bottom',
  ...base,
});

export default {
  model: {
    partLabels: true,
    partLabelType: 'Letters',
    // partialScoring: false,
    partA: partModel(),
    partB: partModel(),
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
    partialScoring: {
      label: 'Allow Partial Scoring',
      // this will turn off partial scoring toggle in the settings tab by default for the interaction
      // as we'd like partial scoring to be controlled from the environment entirely
      // if any other consumers would like to enable it for themselves, they can do so from their model directly.
      settings: false,
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    partA: cloneDeep(defaultConfig),
    partB: cloneDeep(defaultConfig),
    partLabels: {
      settings: true,
      label: 'Part Labels',
    },
    settingsPanelDisabled: false,
    language: {
      settings: false,
      label: 'Specify Language',
      enabled: false,
    },
    languageChoices: {
      label: 'Language Choices',
      options: [],
    },
  },
};
