const choice = (l, v) => ({ label: l, value: v });

const markup = '<p>The {{0}} <br> jumped {{1}} <br> the {{2}}</p>';

exports.model = (id, element) => ({
  id,
  element,
  "markup": "<p>What are the values of <em>x</em> and <em>y</em>?</p><p><em>x</em> = {{0}}</p><p><em>y = </em>{{1}}</p><p></p><table border=\"1\" style=\"min-width: 50px; width: 100%; color: var(--pie-text, black); table-layout: fixed; border-collapse: collapse; background-color: var(--pie-background, rgba(255, 255, 255));\"><colgroup><col style=\"min-width: 25px;\"><col style=\"min-width: 25px;\"></colgroup><tbody><tr><td colspan=\"1\" rowspan=\"1\"><p>Month</p></td><td colspan=\"1\" rowspan=\"1\"><p>Total Cost</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>1</p></td><td colspan=\"1\" rowspan=\"1\"><p>${{2}}</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>2</p></td><td colspan=\"1\" rowspan=\"1\"><p>${{3}}</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>3</p></td><td colspan=\"1\" rowspan=\"1\"><p>${{4}}</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>4</p></td><td colspan=\"1\" rowspan=\"1\"><p>${{5}}</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>5</p></td><td colspan=\"1\" rowspan=\"1\"><p>${{6}}</p></td></tr></tbody></table><p></p>",
  "disabled": false,
  "choices": {
    "0": [
      {
        "label": "1",
        "value": "0"
      }
    ],
    "1": [
      {
        "label": "2",
        "value": "0"
      }
    ],
    "2": [
      {
        "label": "three",
        "value": "0"
      }
    ],
    "3": [
      {
        "label": "4",
        "value": "0"
      }
    ],
    "4": [
      {
        "label": "5",
        "value": "0"
      }
    ],
    "5": [
      {
        "label": "6",
        "value": "0"
      }
    ]
  },
  "prompt": "<p>Subtract.</p><p>wsfsf</p><p>fs</p><p>fsfvsdfvd</p><p></p><p></p><p></p><p>sfsafsfsa<br><br>ddsvdvdsvsvsdvbsd</p>",
  "promptEnabled": true,
  "displayType": "block",
  "maxLengthPerChoiceEnabled": true,
  "playerSpellCheckEnabled": true,
  "rationale": "<p>ffew</p><p>fefefef</p><p></p><p>sdfdegdsgsg<br>dfvsdv<br><br>bbsfbbsfgbs<br><br>dfvdvsdvv</p>",
  "rationaleEnabled": true,
  "spellCheckEnabled": true,
  "studentInstructionsEnabled": true,
  "teacherInstructions": "<p>rsfvsv</p><p>fdggs</p><p>gdgdg</p><p>dsg</p>",
  "teacherInstructionsEnabled": true,
  "toolbarEditorPosition": "bottom",
  "responseAreaInputConfiguration": {
    "characters": {
      "disabled": true
    }
  },
  "slateMarkup": "<p>What are the values of <em>x</em> and <em>y</em>?</p><p><em>x</em> = <span data-type=\"explicit_constructed_response\" data-index=\"0\" data-value=\"\"></span></p><p><em>y = </em><span data-type=\"explicit_constructed_response\" data-index=\"1\" data-value=\"\"></span></p><p></p><table border=\"1\" style=\"min-width: 50px; width: 100%; color: var(--pie-text, black); table-layout: fixed; border-collapse: collapse; background-color: var(--pie-background, rgba(255, 255, 255));\"><colgroup><col style=\"min-width: 25px;\"><col style=\"min-width: 25px;\"></colgroup><tbody><tr><td colspan=\"1\" rowspan=\"1\"><p>Month</p></td><td colspan=\"1\" rowspan=\"1\"><p>Total Cost</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>1</p></td><td colspan=\"1\" rowspan=\"1\"><p>$<span data-type=\"explicit_constructed_response\" data-index=\"2\" data-value=\"\"></span></p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>2</p></td><td colspan=\"1\" rowspan=\"1\"><p>$<span data-type=\"explicit_constructed_response\" data-index=\"3\" data-value=\"\"></span></p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>3</p></td><td colspan=\"1\" rowspan=\"1\"><p>$<span data-type=\"explicit_constructed_response\" data-index=\"4\" data-value=\"\"></span></p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>4</p></td><td colspan=\"1\" rowspan=\"1\"><p>$<span data-type=\"explicit_constructed_response\" data-index=\"5\" data-value=\"\"></span></p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>5</p></td><td colspan=\"1\" rowspan=\"1\"><p>$<span data-type=\"explicit_constructed_response\" data-index=\"6\" data-value=\"\"></span></p></td></tr></tbody></table><p></p>",
  "maxLengthPerChoice": [
    1,
    1,
    9,
    2,
    9,
    3,
    3
  ]
});
