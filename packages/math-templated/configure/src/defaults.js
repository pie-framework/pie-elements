// Should be exactly the same as controller/defaults.js
export default {
  model: {
    prompt: 'Question Prompt goes here',
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    rationale: 'Rationale goes here',
    rationaleEnabled: true,
    responses: [{
      allowSpaces: true,
      answer: '100',
      id: '1',
    },
      {
        allowSpaces: true,
        answer: '120',
        id: '2',
      }],
    element: 'math-templated',
    equationEditor: '8',
  },
  configuration: {
    prompt: {
      label: 'Prompt',
      settings: true,
    },
    teacherInstructions: {
      label: 'Teacher Instructions',
      settings: true,
    },
    rationale: {
      label: 'Rationale',
      settings: true,
    },
  },
};
