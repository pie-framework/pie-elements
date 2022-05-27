exports.model = (id, element) => ({
  id,
  element,

  addCategoryEnabled: true,
  categoryDefaultLabel: 'Category',
  chartType: 'bar',
  correctAnswer: {
    data: [
      {
        label: 'A',
        value: 1,
        initial: true,
        interactive: false,
        editable: true,
        deletable: true
      },
      {
        label: 'B',
        value: 1,
        initial: true,
        interactive: true,
        editable: true,
        deletable: true
      },
      {
        label: 'C',
        value: 1,
        initial: true,
        interactive: true,
        editable: true,
        deletable: true
      },
    ]
  },
  data: [
    {
      label: 'A',
      value: 1,
      initial: true,
      interactive: false,
      editable: true,
      deletable: true
    },
    {
      label: 'B',
      value: 1,
      initial: true,
      interactive: true,
      editable: true,
      deletable: true
    },
    {
      label: 'D',
      value: 2,
      initial: true,
      interactive: true,
      editable: true,
      deletable: true
    },
  ],
  domain: {
    label: 'Characters',
  },
  //editCategoryEnabled: true,
  graph: {
    width: 480,
    height: 480
  },
  prompt: 'Here goes item stem!',
  promptEnabled: true,
  rationale: 'Rationale goes here!',
  range: {
    label: 'Amount',
    max: 3,
    min: 0,
    labelStep: 1,
  },
  title: 'This is a chart!',
});
