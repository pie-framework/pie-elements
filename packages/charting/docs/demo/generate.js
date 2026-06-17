exports.model = (id, element) => ({
  id,
  element,
  addCategoryEnabled: true,
  changeInteractiveEnabled: true,
  changeEditableEnabled: true,
  changeAddCategoryEnabled: true,
  chartType: 'bar',
  correctAnswer: {
    data: [
      {
        label: 'A',
        value: 1,
      },
      {
        label: 'B',
        value: 1,
      },
      {
        label: 'C',
        value: 1,
      },
    ],
  },
  data: [
    {
      label: 'A',
      value: 1,
      interactive: false,
      editable: false,
    },
    {
      label: 'B',
      value: 1,
      interactive: true,
      editable: false,
    },
    {
      label: 'C',
      value: 2,
      interactive: true,
      editable: false,
    },
  ],
  domain: {
    label:
      '<div>Math in the bottom label: <span data-latex="" data-raw="3x^2">\\(3x^2\\)</span>\u200b</div>',
  },
  graph: {
    width: 480,
    height: 480,
  },
  prompt: 'Here goes item stem!',
  promptEnabled: true,
  rationale: 'Rationale goes here!',
  range: {
    label:
      '<div>Math in the left label: <span data-latex="" data-raw="\\frac{\\pi}{2}">\\(\\frac{\\pi}{2}\\)</span>\u200b</div>',
    max: 3,
    min: 0,
    labelStep: 1,
  },
  title:
    '<div>Math in the title: <span data-latex="" data-raw="\\frac{x}{y}">\\(\\frac{x}{y}\\)</span>\u200b</div>',
  rubricEnabled: false,
});
