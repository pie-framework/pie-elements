export const model = {
  correctResponse: [],
  graph: {
    domain: {
      min: -1,
      max: 1,
    },
    ticks: {
      minor: 0.125,
      major: 0.5,
      labelStep: '1/2',
      tickIntervalType: 'F',
      tickStep: '1/8',
    },
    arrows: {
      left: true,
      right: true,
    },
    maxNumberOfPoints: 1,
    width: 500,
    initialType: 'PF',
    exhibitOnly: false,
    toolbarEditorPosition: 'bottom',
    availableTypes: {
      PF: true,
    },
    initialElements: [],
  },
  widthEnabled: true,
  feedback: {
    correct: {
      default: 'Correct',
      type: 'none',
    },
    incorrect: {
      default: 'Incorrect',
      type: 'none',
    },
    partial: {
      default: 'Nearly',
      type: 'none',
    },
  },
};

export const configuration = {
  instruction: {
    settings: false,
    label:
      'Number line questions involve plotting points or other objects. To create one, first set up the number line, then select the plotting tools students will be offered and use them to define the correct answer.',
  },
  prompt: {
    settings: true,
    label: 'Item Stem',
  },
  teacherInstructions: {
    settings: true,
    label: 'Teacher Instructions',
  },
  numberLineDimensions: {
    settings: true,
    label: 'Width',
    enabled: true,
    min: 150,
    max: 800,
    step: 20,
  },
  spellCheck: {
    label: 'Spellcheck',
    settings: false,
    enabled: true,
  },
  mathMlOptions: {
    mmlOutput: false,
    mmlEditing: false,
  },
  language: {
    settings: false,
    label: 'Specify Language',
    enabled: false,
  },
  languageChoices: {
    label: 'Language Choices',
    options: [],
  },
  maxMaxElements: 10,
  hidePointConfigButtons: false,
  // availableTools: ["PF"],
  availableTools: ['PF', 'LFF', 'LEF', 'LFE', 'LEE', 'RFN', 'RFP', 'REN', 'REP'],
};
