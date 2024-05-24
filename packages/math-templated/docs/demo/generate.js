exports.model = (id, element) => ({
  id,
  element,
  "rationale": "Rationale",
  "partialScoring": true,
  "prompt": "Prompt",
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
  "teacherInstructions": "TeacherInstructions",

  "customKeys": [], // these have effect on player only?
  "equationEditor": "geometry",

  "markup": "<p>{{0}} + {{1}} = {{2}}<span data-latex=\"\" data-raw=\"\\theta\">\\theta</span></p>",
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
