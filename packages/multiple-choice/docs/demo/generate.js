exports.model = (id, element) => ({
  id,
  element,
  choiceMode: 'checkbox',
  choicePrefix: 'numbers',
  choices: [
    {
      correct: true,
      value: 'sweden',
      label: 'Sweden',
      feedback: {
        type: 'none',
        value: '',
      },
      accessibility: 'sweden',
    },
    {
      value: 'iceland',
      label: 'Iceland',
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Iceland',
      accessibility: 'iceland',
    },
    {
      value: 'norway',
      label: 'Norway',
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Norway',
      accessibility: 'norway',
    },
    {
      correct: true,
      value: 'finland',
      label: 'Finland',
      feedback: {
        type: 'none',
        value: '',
      },
      rationale: 'Rationale for Finland',
      accessibility: 'finland',
    },
  ],
  "prompt": "<div>Lilly was recording the distances she ran last week and collected the following data.</div><div></div><div><table border=\"1\" cellspacing=\"1\" cellpadding=\"1\" style=\"width: 100%;\"><thead><tr><th scope=\"col\">Day</th><th scope=\"col\">Distance (miles)</th></tr></thead><tbody><tr><td>Monday</td><td>3</td></tr><tr><td>Tuesday</td><td>4</td></tr><tr><td>Wednesday</td><td>2</td></tr><tr><td>Thursday</td><td>4</td></tr><tr><td>Friday</td><td>4</td></tr><tr><td>Saturday</td><td>5</td></tr></tbody></table><br /><br />Represent this data on the line plot below.</div>",  promptEnabled: true,
  toolbarEditorPosition: 'bottom',
  rubricEnabled: false,
});
