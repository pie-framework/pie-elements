exports.model = (id, element) => ({
  id,
  element,
  "disabled": false,
    "mode": "gather",
    "prompt": "Use the dropdowns to complete the sentence",
    "shuffle": true,
    "markup": "<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>",
    "choices": {
  "0": [
    {
      "label": "cow ",
      "value": "0",
      "correct": false,
      "rationale": "rationale cow"
    },
    {
      "label": "dog ",
      "value": "1",
      "correct": false,
      "rationale": "rationale dog"
    },
    {
      "label": "cat ",
      "value": "2",
      "correct": false,
      "rationale": "rationale car"
    },
    {
      "label": "<div><span data-latex=\"\" data-raw=\"\\longdiv{weweew}\">\\longdiv{weweew}</span></div>",
      "value": "3",
      "correct": true
    }
  ],
      "1": [
    {
      "label": "over ",
      "value": "0",
      "correct": true,
      "rationale": "rationale over"
    },
    {
      "label": "under ",
      "value": "1",
      "correct": false,
      "rationale": "rationale under"
    },
    {
      "label": "across ",
      "value": "2",
      "correct": false,
      "rationale": "rationale across"
    }
  ],
      "2": [
    {
      "label": "moon ",
      "value": "0",
      "correct": true,
      "rationale": "rationale moon"
    },
    {
      "label": "sun",
      "value": "2",
      "correct": false,
      "rationale": "rationale sun"
    },
    {
      "label": "house ",
      "value": "3",
      "correct": false,
      "rationale": "rationale house"
    }
  ]
},
  "alternateResponse": {},
  "promptEnabled": true,
    "rationaleEnabled": true,
    "choiceRationaleEnabled": false,
    "teacherInstructionsEnabled": true,
    "studentInstructionsEnabled": true,
    "toolbarEditorPosition": "bottom",
    "displayType": "block",
    "rubricEnabled": false,
    "slateMarkup": "<div><p>The <span data-type=\"inline_dropdown\" data-index=\"0\" data-value=\"<div><span data-latex=&quot;&quot; data-raw=&quot;\\longdiv{weweew}&quot;>\\longdiv{weweew}</span></div>\"></span> jumped <span data-type=\"inline_dropdown\" data-index=\"1\" data-value=\"over \"></span> the <span data-type=\"inline_dropdown\" data-index=\"2\" data-value=\"moon \"></span></p></div>",
});
