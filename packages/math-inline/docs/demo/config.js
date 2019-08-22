module.exports = {
  elements: {
    'math-inline': '../..'
  },
  models: [
    {
      partialScoring: true,
      responseType: 'Advanced Multi',
      element: 'math-inline',
      feedback: {
        correct: { default: 'Correct', type: 'none' },
        incorrect: { default: 'Incorrect', type: 'none' },
        partial: { default: 'Nearly', type: 'none' }
      },
      equationEditor: '6',
      expression: '\\${{response}}',
      rationale: 'Rationale goes here.',
      question:
        '<p>Khloe goes&#160;into a snack bar with exactly&#160;$20.00. She buys five&#160;bottles of water that cost $1.58&#160;each and a pack of gum that costs $0.80. The snack bar prices include sales tax. After she pays and receives her&#160;change, Khloe&#39;s friend Andy&#160;gives her&#160;half the cost of the water bottles. How much money does she have now?</p><p>Use the on-screen keyboard to type the correct answer in the box.</p>',
      response: {
        answer: '72\\div12=6\\text{eggs}',
        alternates: {
          '1': '6=72\\div12\\text{eggs}',
          '2': '\\frac{72}{12}=6\\text{eggs}',
          '3': '6=\\frac{72}{12}\\text{eggs}'
        },
        validation: 'literal'
      },
      responses: [
        {
          allowSpaces: true,
          answer: '\\text{$}15.25',
          id: '1',
          alternates: {},
          validation: 'literal'
        }
      ],
      customKeys: ['\\left(\\right)', '\\frac{}{}', 'x\\frac{}{}'],
      scoringType: 'auto',
      id: '1',
      allowFeedback: true
    }
  ]
};
