exports.model = (id, element) => ({
  "choiceMode": "checkbox",
  "choicePrefix": "letters",
  "choices": [
      {
          "correct": false,
          "label": "<p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>0</mn><mtext>.</mtext><mn>2</mn><mo>&#60;</mo><mn>0</mn><mtext>.</mtext><mn>07</mn></math></p>",
          "rationale": "<p>Student(s) may not have considered place value when comparing the decimals. Student(s) may have reasoned that since 2 is less than 7, 0.2 is less than 0.07.</p>",
          "value": "8a808081841c101e01843f614bd4117a"
      },
      {
          "correct": false,
          "label": "<p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>0</mn><mtext>.</mtext><mn>47</mn><mo>&#62;</mo><mn>0</mn><mtext>.</mtext><mn>62</mn></math></p>",
          "rationale": "<p>Student(s) may have selected this option because they compared the value of the digits in the hundredths place without considering the values of the digits in the tenths place.</p>",
          "value": "8a808081841c101e01843f614bd31178"
      },
      {
          "correct": true,
          "label": "<p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>0</mn><mtext>.</mtext><mn>55</mn><mo>&#60;</mo><mn>0</mn><mtext>.</mtext><mn>6</mn></math></p>",
          "value": "8a808081841c101e01843f614bd41179",
          "rationale": "<p>Correct answer</p>"
      },
      {
          "correct": true,
          "label": "<p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>1</mn><mtext>.</mtext><mn>57</mn><mo>&#60;</mo><mn>1</mn><mtext>.</mtext><mn>88</mn></math></p>",
          "rationale": "<p>Correct answer</p>",
          "value": "8a808081841c101e01843f614bd31177"
      },
      {
          "correct": false,
          "label": "<p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>3</mn><mtext>.</mtext><mn>38</mn><mo>&#62;</mo><mn>3</mn><mtext>.</mtext><mn>4</mn></math></p>",
          "rationale": "<p>Student(s) may have compared the numbers after the decimal in the same way they would compare whole numbers. Student(s) may have selected this option because 38 is greater than 4.</p>",
          "value": "8a808081841c101e01843f614bd4117b"
      }
  ],
  "prompt": "<p>Which comparisons are true? Choose <span class=\"relative-emphasis\">two</span> that are correct.</p>",
  "lockChoiceOrder": false,
  "partialScoring": true,
  "scoringType": "auto",
  "feedbackEnabled": false,
  "promptEnabled": true,
  "rationaleEnabled": true,
  "teacherInstructionsEnabled": true,
  "studentInstructionsEnabled": true,
  "toolbarEditorPosition": "bottom",
  "choicesLayout": "vertical",
  "gridColumns": "2",
  "keyMode": "none",
  "teacherInstructions": "",
  "id": id,
  "element": element
});
