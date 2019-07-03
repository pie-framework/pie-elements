const tokens = () => [
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    start: 0,
    end: 55,
  },
];

export default {
  model: {
    highlightChoices: false,
    partialScoring: false,
    maxSelections: 2,
    mode: 'sentence',
    prompt: 'Question Prompt goes here',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    tokens: tokens(),
    scoringType: 'auto',
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
      enabled: false,
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
      enabled: false,
    },
    prompt: {
      label: 'Prompt'
    },
    text: {
      settings: true,
      label: 'Content'
    },
    tokens: {
      settings: true,
      label: 'Tokens'
    },
    feedback: {
      settings: true
    },
    partialScoring: {
      settings: true,
      label: 'Allow Partial Scoring',
    },
    mode: {
      settings: true,
      label: 'Mode'
    },
  }
};
