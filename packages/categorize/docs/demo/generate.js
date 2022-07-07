exports.model = (id, element) => ({
  id,
  element,
  promptEnabled: true,
  choices: [
    {
      id: 'id-mar',
      content: '<div>mar</div>',
    },
    {
      id: 'id-para',
      content: '<div>para</div>',
    },
    {
      id: 'id-rosie',
      content: '<div>rosie</div>',
    },
    {
      id: 'id-morcov',
      content: '<div>morcov</div>',
      categoryCount: 2,
    },
  ],
  choicesPosition: 'below',
  choicesLabel: '',
  lockChoiceOrder: true,
  removeTilesAfterPlacing: false,
  categoriesPerRow: 2,
  categories: [
    {
      id: 'id-fructe',
      label: '<div>fructe</div>',
    },
    {
      id: 'id-legume',
      label: '<div>legume</div>',
    },
  ],
  alternates: [],
  correctResponse: [
    {
      category: 'id-fructe',
      choices: ['id-mar', 'id-mar', 'id-mar', 'id-para'],
      alternateResponses: [
        ['id-mar', 'id-para', 'id-rosie'],
        ['id-mar', 'id-para', 'id-rosie'],
      ],
    },
    {
      category: 'id-legume',
      choices: ['id-rosie', 'id-rosie', 'id-morcov'],
      alternateResponses: [['id-rosie', 'id-morcov'], ['id-morcov']],
    },
  ],
  rowLabels: ['', ''],
  partialScoring: true,
  feedbackEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  toolbarEditorPosition: 'bottom',
  note: 'The answer shown above is the most common correct answer for this item. One or more additional correct answers are also defined, and will also be recognized as correct.',
});
