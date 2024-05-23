exports.model = (id, element) => ({
  id,
  element,
  "rationale": "",
  "partialScoring": true,
  "prompt": "",
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
  "teacherInstructions": "",

  "responseType": "Advanced Multi",
  "customKeys": [], // these have effect on player only?
  "equationEditor": "geometry",

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
    },
  }
});
