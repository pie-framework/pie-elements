// Should be exactly the same as controller/defaults.js
export default {
  model: {
    element: 'math-templated',
    equationEditor: '8',
    disabled: false,
    mode: 'gather',
    prompt: 'Use the inputs to complete the sentence',
    shuffle: true,
    markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
    toolbarEditorPosition: 'bottom',
    displayType: 'block',
    spellCheckEnabled: true,
    playerSpellCheckEnabled: true,
    maxLengthPerChoiceEnabled: true,
    rationaleEnabled: true,
    promptEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
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
