const choices = () => [
  {
    id: '1',
    content: '! Choice 1 <span data-latex="">\\(\\frac{2}{1}\\)</span>'
  },
  {
    id: '2',
    content: 'Choice 2 <span data-latex="">\\(\\frac{3}{1}\\)</span>'
  },
  { id: '3', content: 'Choice 3' },
  { id: '4', content: 'Choice 4' }
];
const categories = () => [
  { id: '1', label: 'Category 1' },
  { id: '2', label: 'Category 2' }
];

exports.model = (id, element) => ({
  id,
  element,
  choices: choices(),
  categories: categories(),
  correctResponse: [{}],
  feedback: {
    correct: {
      type: 'default',
      default: 'Correct'
    },
    incorrect: {
      type: 'default',
      default: 'Incorrect'
    },
    partial: {
      type: 'default',
      default: 'Nearly'
    }
  },

  scoring: {
    weighting: {
      enabled: true,
      rules: [{ category: '1', points: 1 }, { category: '2', points: 1 }]
    },
    partial: {
      enabled: true,
      rules: [
        {
          category: '1',
          rules: [{ count: 1, percent: 50 }, { count: 2, percent: 100 }]
        },
        { category: '2', rules: [] }
      ]
    }
  },
  config: {
    choices: {
      columns: 2,
      position: 'above',
      label: 'Here are the choices \\(\\frac{1}{2}\\)',
      shuffle: false
    },
    categories: {
      columns: 2
    }
  }
});
