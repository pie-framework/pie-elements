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
        interactive: false,
        editable: false
      },
      {
        label: 'B',
        value: 1,
        interactive: true,
        editable: false
      },
      {
        label: 'C',
        value: 1,
        interactive: true,
        editable: false
      },
    ]
  },
  data: [
    {
      label: 'A',
      value: 1,
      interactive: false,
      editable: false
    },
    {
      label: 'B',
      value: 1,
      interactive: true,
      editable: false
    },
    {
      label: 'D',
      value: 2,
      interactive: true,
      editable: false
    },
  ],
  domain: {
    label: 'Characters',
  },
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
