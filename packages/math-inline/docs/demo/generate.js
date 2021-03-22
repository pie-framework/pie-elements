exports.model = (id, element) => ({
  id,
  element,
  customKeys: [],
  equationEditor: 'geometry',
  responseType: 'Advanced Multi',
  expression: '{{response}}',
  responses: [
    {
      answer: 'r=\\sqrt{\\frac{V}{7\\pi}}',
      id: '1',
      alternates: {},
      validation: 'literal'
    }
  ],
  rationale:
    '<p>The correct answer is:</p><ul><li><math xmlns="http://www.w3.org/1998/Math/MathML"><mi>r</mi><mo>=</mo><msqrt><mfrac><mi>V</mi><mrow><mn>7</mn><mi>&#960;</mi></mrow></mfrac></msqrt></math></li></ul>',
});
