exports.model = (id, element) => ({
  id,
  element,
  rationale: 'Rationale',
  partialScoring: true,
  prompt: 'There are 24 students in the class. They had the choice to buy supplies from two different stores, Store A and B. Each of them bought 2 binders and 5 notebooks. The students have a total of $420 to spend.',
  scoringType: 'auto',
  feedbackEnabled: false,
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  toolbarEditorPosition: 'bottom',
  validationDefault: 'literal',
  ignoreOrderDefault: false,
  allowTrailingZerosDefault: false,
  teacherInstructions: 'These are teacher instructions',
  customKeys: [], // these have effect on player only?
  equationEditor: 'geometry',
  markup: `
    <p>If the unit price of a notebook in Store A is $1.50, what is the unit price of a binder? \${{0}}</p>
    <p>If the unit price of a binder in Store B is $2.80, what is the unit price of a notebook? \${{1}}</p>
  `,
  responses: {
    0: {
      allowTrailingZeros: false,
      answer: '5',
      id: '1',
      validation: 'symbolic',
      ignoreOrder: false,
      alternates: {}
    },
    1: {
      allowTrailingZeros: false,
      answer: '2.38',
      id: '1',
      validation: 'literal',
      ignoreOrder: false,
      alternates: {}
    }
  }
});
