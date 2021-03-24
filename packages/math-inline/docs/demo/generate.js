const initialModel = {
  customKeys: [],
  equationEditor: 'geometry',
  responseType: 'Advanced Multi',
  expression: '{{response}}',
  responses: [
    {
      allowSpaces: true,
      answer: 'r=\\sqrt{\\frac{V}{7\\pi}}',
      id: '1',
      alternates: {},
      validation: 'literal'
    }
  ],
  rationale:
    '<p>The correct answer is:</p><ul><li><math xmlns="http://www.w3.org/1998/Math/MathML"><mi>r</mi><mo>=</mo><msqrt><mfrac><mi>V</mi><mrow><mn>7</mn><mi>&#960;</mi></mrow></mfrac></msqrt></math></li></ul>',
}

const E262456 = {
  'equationEditor': 3,
  'prompt': '<p><strong>B.</strong> Find the value of the expression that you wrote in part A to find how much money the band members made.</p>\n\n<p>Use the on-screen keyboard to type your answer in the box below.</p>\n',
  'expression': '${{response}}',
  'responses': [
    {
      'allowSpaces': true,
      'validation': 'symbolic',
      'answer': '$410',
      'id': '1'
    }
  ],
  'responseType': 'Advanced Multi',
  'allowTrailingZeros': {
    enabled: true,
    label: 'Allow Trailing Zeros',
    default: true
  }
};


exports.model = (id, element) => ({
  id,
  element,
  ...E262456
});
