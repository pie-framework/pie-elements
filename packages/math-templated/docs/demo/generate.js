exports.model = (id, element) => ({
  id,
  element,
  "rationale": "<p>The correct answer is:</p><ul><li><span data-type=\"mathml\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>r</mi><mo>=</mo><msqrt><mfrac><mi>V</mi><mrow><mn>7</mn><mi>π</mi></mrow></mfrac></msqrt></math></span></li></ul>",
  "partialScoring": true,
  "feedback": {
    "correct": { "default": "Correct", "type": "none" },
    "incorrect": { "default": "Incorrect", "type": "none" },
    "partial": { "default": "Nearly", "type": "none" }
  },
  "prompt": "<div></div>",
  "scoringType": "auto",
  "feedbackEnabled": false,
  "promptEnabled": true,
  "rationaleEnabled": true,
  "teacherInstructionsEnabled": true,
  "studentInstructionsEnabled": true,
  "toolbarEditorPosition": "bottom",
  "validationDefault": "literal",
  "ignoreOrderDefault": false,
  "allowTrailingZerosDefault": false,
  "teacherInstructions": "<div></div>",

  "responseType": "Advanced Multi",
  "customKeys": [], // these have effect on player only?
  "equationEditor": "geometry",

  // from math inline
  // "expression": "{{response}}{{response}}",
  // "responses": [
  //   {
  //     "allowSpaces": true,
  //     "answer": "r=\\sqrt{\\frac{V}{7\\pi}}",
  //     "id": "1",
  //     "alternates": { "1": "test", "2": "alternate" },
  //     "validation": "symbolic",
  //     "allowTrailingZeros": false,
  //     "ignoreOrder": false
  //   },
  //   {
  //     "allowSpaces": true,
  //     "answer": "r=\\sqrt{\\frac{V}{7\\pi}}",
  //     "id": "2",
  //     "alternates": { "1": "test 2", "2": "alternate 2" },
  //     "validation": "symbolic",
  //     "allowTrailingZeros": false,
  //     "ignoreOrder": false
  //   }
  // ],

  //
  // // from ecr:
  // "markup": "<p>The {{0}} jumped {{1}} the {{2}}</p>",
  // "choices": {
  //   "0": [
  //     { "label": "cow", "value": "0" },
  //     { "label": "cattle", "value": "1" },
  //     { "label": "calf", "value": "2" }
  //   ],
  //   "1": [
  //     { "label": "over", "value": "0" },
  //     { "label": "past", "value": "1" },
  //     { "label": "beyond", "value": "2" }
  //   ],
  //   "2": [ { "label": "moon", "value": "0" } ]
  // },

  // what I am thinking for math-template
  "markup": "<p>{{0}} + {{1}} = {{2}}</p>",
  "responses": {
    "0": {
      "allowSpaces": true,
      "validation": "symbolic",
      "allowTrailingZeros": false,
      "ignoreOrder": false,
      "answer": "a",
      "alternates": { "0": "test", "1": "alternate" },
    },
    "1": {
      "allowSpaces": true,
      "validation": "symbolic",
      "allowTrailingZeros": false,
      "ignoreOrder": false,
      "answer": "b",
      "alternates": { "0": "test 2" },
    },
    "2": {
      "allowSpaces": true,
      "validation": "symbolic",
      "allowTrailingZeros": false,
      "ignoreOrder": false,
      "answer": "c",
      // "alternates": { "0": "test", "1": "alternate" },
    },
  }
});
