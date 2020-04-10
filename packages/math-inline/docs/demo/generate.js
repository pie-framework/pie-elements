exports.model = (id, element) => ({
  id,
  element,
  customKeys: [
    '<',
    '\\le',
    '\\ge',
    '>',
    '\\frac{}{}',
    'x^{}',
    '\\left(\\right)',
    '\\abs{}',
    '\\sqrt{}',
    '\\sqrt[n]{}',
    '\\pi',
    '\\iota',
    '\\sin',
    '\\cos',
    '\\tan',
    '\\arcsin',
    '\\arccos',
    '\\arctan',
    'r',
    'V_uppercase',
    '\\fract'
  ],
  equationEditor: 'geometry',
  responseType: 'Advanced Multi',
  expression: '{{response}}',
  responses: [
    {
      allowSpaces: true,
      answer: 'r=\\sqrt{\\frac{V}{7\\pi}}',
      id: '1',
      alternates: {},
      validation: 'symbolic'
    }
  ],
  rationale:
    '<p>The correct answer is:</p><ul><li><math xmlns="http://www.w3.org/1998/Math/MathML"><mi>r</mi><mo>=</mo><msqrt><mfrac><mi>V</mi><mrow><mn>7</mn><mi>&#960;</mi></mrow></mfrac></msqrt></math></li></ul>',
});
