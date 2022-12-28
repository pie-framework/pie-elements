const tokens = () => [
  {
    text: '',
    start: 0,
    end: 0,
  },
];

export default {
  model: {
    highlightChoices: false,
    partialScoring: false,
    maxSelections: 2,
    mode: 'sentence',
    prompt: 'Question Prompt goes here',
    text: '',
    tokens: tokens(),
    scoringType: 'auto',
    feedbackEnabled: true,
    rationaleEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
  },
  configuration: {
    selectionCount: {
      settings: true,
      label: 'Selection count',
    },
    correctAnswer: {
      settings: true,
      label: 'Correct Answers',
    },
    selections: {
      settings: true,
      label: 'Selections Available',
    },
    highlightChoices: {
      settings: true,
      label: 'Highlight choices',
    },
    rationale: {
      settings: true,
      label: 'Rationale',
    },
    scoringType: {
      settings: false,
      label: 'Scoring Type',
    },
    studentInstructions: {
      settings: false,
      label: 'Student Instructions',
    },
    teacherInstructions: {
      settings: true,
      label: 'Teacher Instructions',
    },
    prompt: {
      label: 'Prompt',
      settings: true,
    },
    text: {
      settings: true,
      label: 'Content',
    },
    tokens: {
      settings: true,
      label: 'Tokens',
    },
    feedback: {
      settings: true,
      label: 'Feedback',
    },
    settingsPanelDisabled: false,
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    partialScoring: {
      settings: false,
      label: 'Allow Partial Scoring',
    },
    mode: {
      settings: true,
      label: 'Mode',
    },
    minTokens: 2,
    maxImageWidth: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    maxImageHeight: {
      teacherInstructions: 300,
      prompt: 300,
      rationale: 300,
    },
    withRubric: {
      settings: false,
      label: 'Add Rubric',
    },
  },
};
