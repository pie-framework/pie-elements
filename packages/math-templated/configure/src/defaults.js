// Should be exactly the same as controller/defaults.js
const markup = '<p>a is {{0}} <br> b is {{1}} <br> c is {{2}}</p>';

export default {
  model: {
    markup,
    prompt: 'Question Prompt goes here',
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    rationale: 'Rationale goes here',
    rationaleEnabled: true,
    responses: {
      0: [{ id: 'response0', allowSpaces: true, answer: '100' }, { id: 'response0', allowSpaces: true, answer: '120' }],
      1: [{ id: 'response1', allowSpaces: true, answer: '200' }],
      2: [{ id: 'response2', allowSpaces: true, answer: '250' }]

    },
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
