export default {
  choices: [
    {
      id: '0',
      content: '<span mathjax="" data-latex="">420\\text{ cm}=4.2\\text{ meters}</span>'
    },
    {
      id: '1',
      content: '<span mathjax="" data-latex="" data-raw="3.4\\text{ kg}=350\\text{ g}">3.4\\text{ kg}=340\\text{ g}</span>'
    },
  ],
  categories: [
    {
      id: '0',
      label: 'Equivalent',
      choices: [
        {
          id: '0',
          content: '<span mathjax="" data-latex="">420\\text{ cm}=4.2\\text{ meters}</span>'
        },
      ]
    },
    {
      id: '1',
      label: '<b>NOT </b>equivalent',
      choices: [
        {
          id: '1',
          content: '<span mathjax="" data-latex="">3.4\\text{ kg}=340\\text{ g}</span>'
        },
      ]
    }
  ],
  correctResponse: [
    {
      category: '0',
      choices: ['0']
    },
    {
      category: '1',
      choices: ['1']
    }
  ],
  config: {
    choices: {
      columns: 2,
      position: 'below',
    },
    categories: {
      columns: 2
    }
  }
};
