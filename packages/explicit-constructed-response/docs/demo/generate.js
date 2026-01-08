const choice = (l, v) => ({ label: l, value: v });

const markup = '<p>The {{0}} <br> jumped {{1}} <br> the {{2}}</p>';

exports.model = (id, element) => ({
  id,
  element,
  "disabled": false,
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
});
