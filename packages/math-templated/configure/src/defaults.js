// Should be exactly the same as controller/defaults.js
export default {
  model: {
    markup: '<p>a is {{0}} <br> b is {{1}} <br> c is {{2}}</p>',
    prompt: 'Question Prompt goes here',
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    rationale: 'Rationale goes here',
    rationaleEnabled: true,
    spellCheckEnabled: true,
    playerSpellCheckEnabled: true,
    responses: {
      0: [{ id: 'response0', allowSpaces: true, answer: '100' }, { id: 'response0', allowSpaces: true, answer: '120' }],
      1: [{ id: 'response1', allowSpaces: true, answer: '200' }],
      2: [{ id: 'response2', allowSpaces: true, answer: '250' }]

    },
    element: 'math-templated',
    equationEditor: '8',
  },
  configuration: {
    baseInputConfiguration: {
      html: { disabled: true },
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
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
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
    editSource: {
      label: 'Edit Source',
      settings: false,
      enabled: false,
    },
    playerSpellCheck: {
      label: 'Student Spellcheck',
      settings: true,
      enabled: true,
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
    template: {
      inputConfiguration: {
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
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
