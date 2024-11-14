const partModel = (base) => ({
  choiceMode: 'radio',
  choicePrefix: 'letters',
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
  partLabels: true,
  partLabelType: 'Letters',
  partA: partModel(),
  partB: partModel(),
};
