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
    feedbackEnabled: false,
    rationaleEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    toolbarEditorPosition: 'bottom',
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
    },
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
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
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
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
    },
    prompt: {
      label: 'Prompt',
      settings: true,
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
      required: false,
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
  },
};
