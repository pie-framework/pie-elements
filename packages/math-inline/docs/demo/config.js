module.exports = {
  elements: {
    'math-inline': '../..'
  },
  models: [
    {
      id: '1',
      element: 'math-inline',
      mode: 'advanced',
      feedback: {
        correct: {
          default: 'Correct',
          type: 'none'
        },
        incorrect: {
          default: 'Incorrect',
          type: 'none'
        },
        partial: {
          default: 'Nearly',
          type: 'none'
        }
      },
      equationEditor: '3',
      expression: '{{response}} = {{response}} \\text{eggs}',
      question:
        '<p>Sam sells baskets of eggs at his farm stand. He sold 12 baskets and wrote the number sentence below to show how many eggs he sold in all.</p><p><span class="equation-block"><math xmlns="http://www.w3.org/1998/Math/MathML" >\n <mrow>\n  <mn>12</mn><mo>&#x00D7;</mo><mo>&#x25A1;</mo><mo>=</mo><mn>72</mn>\n </mrow>\n</math> </span></p><p>What <span class="relative-emphasis">division</span> number sentence can be used to show how many eggs were in each basket?</p><p>Use the on-screen keyboard to type your number sentence and answer in the box.</p>',
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
          id: '1',
          answer: '72\\div12=6\\text{eggs}',
          alternates: {
            '1': '6=72\\div12\\text{eggs}',
            '2': '\\frac{72}{12}=6\\text{eggs}',
            '3': '6=\\frac{72}{12}\\text{eggs}'
          },
          validation: 'literal'
        }
      ]
    }
  ]
};
