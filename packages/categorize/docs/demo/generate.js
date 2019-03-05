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
  'choices': [
    {
      'id': '0',
      'content': '<span mathjax="" data-latex="">420\\text{ cm}=4.2\\text{ meters}</span>'
    },
    {
      'id': '1',
      'content': '<span mathjax="" data-latex="" data-raw="3.4\\text{ kg}=350\\text{ g}">3.4\\text{ kg}=340\\text{ g}</span>'
    },
    {
      'id': '2',
      'content': '<span mathjax="" data-latex="">1\\text{,}800\\text{ mL}=180\\text{ L}</span>'
    },
    {
      'id': '3',
      'content': '<span mathjax="" data-latex="">3.5\\text{ meters}=350\\text{ cm}</span>'
    },
    {
      'id': '4',
      'content': '<span mathjax="" data-latex="">4\\text{,}800\\text{ g}=0.48\\text{ kg}</span>'
    },
    {
      'id': '5',
      'content': '<span mathjax="" data-latex="">250\\text{ mL}=0.25\\text{ L}</span>'
    }
  ],
  'categories': [
    {
      'id': '0',
      'label': 'Equivalent',
      'choices': [
        {
          'id': '0',
          'content': '<span mathjax="" data-latex="">420\\text{ cm}=4.2\\text{ meters}</span>'
        },
        {
          'id': '3',
          'content': '<span mathjax="" data-latex="">3.5\\text{ meters}=350\\text{ cm}</span>'
        },
        {
          'id': '5',
          'content': '<span mathjax="" data-latex="">250\\text{ mL}=0.25\\text{ L}</span>'
        }
      ]
    },
    {
      'id': '1',
      'label': '<b>NOT </b>equivalent',
      'choices': [
        {
          'id': '1',
          'content': '<span mathjax="" data-latex="">3.4\\text{ kg}=340\\text{ g}</span>'
        },
        {
          'id': '2',
          'content': '<span mathjax="" data-latex="">1\\text{,}800\\text{ mL}=180\\text{ L}</span>'
        },
        {
          'id': '4',
          'content': '<span mathjax="" data-latex="">4\\text{,}800\\text{ g}=0.48\\text{ kg}</span>'
        }
      ]
    }
  ],
  'correctResponse': [
    {
      'category': '0',
      'choices': [
        '0',
        '3',
        '5'
      ]
    },
    {
      'category': '1',
      'choices': [
        '4',
        '1',
        '2'
      ]
    }
  ],
  'config': {
    'choices': {
      'columns': 2,
      'position': 'below',
      'label': '',
      'shuffle': false,
      'removeafterplacing': false
    },
    'categories': {
      'columns': 2,
      'rows': 1,
    }
  }
});
