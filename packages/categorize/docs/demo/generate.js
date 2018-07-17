const choices = () => [
  { id: '1', content: 'Choice 1' },
  { id: '2', content: 'Choice 2' },
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
      label: 'Here are the choices',
      shuffle: false
    },
    categories: {
      columns: 2
    }
  }
});
