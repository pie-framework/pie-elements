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
  prompt: "$$\int_{a}^{b} x^2 dx$$",
 // prompt: '<div><span data-type="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>a</mi> <mo>+</mo> <mi>b</mi> <mo>=</mo> <mi>c</mi></math></span></div>',
  promptEnabled: true,
  toolbarEditorPosition: 'bottom',
  rubricEnabled: false,
});
