exports.model = (id, element) => ({
  id,
  element,
  keyMode: 'none',
  lockChoiceOrder: true,
  choiceMode: 'radio',
  choices: [
    {
      correct: false,
      label: '<math><mi>a</mi><mo>=</mo><mroot><mn>4</mn><mn>3</mn></mroot></math>',
      value: '1',
      rationale:
        'Student(s) may have correctly found the cube root of 64, but they may have put it under a cube root sign.',
    },
    {
      correct: false,
      label: '<math><mi>a</mi><mo>=</mo><msqrt><mn>8</mn></msqrt></math>',
      value: '2',
      rationale:
        'Student(s) may have mistaken the exponent of 3 for an exponent of 2 and may have correctly found the square root of 64 and put it under a square root sign.',
    },
    {
      correct: true,
      label: '<math><mi>a</mi><mo>=</mo><mroot><mn>64</mn><mn>3</mn></mroot></math>',
      value: '3',
      rationale: 'Correct answer',
    },
    {
      correct: false,
      label: '<math><mi>a</mi><mo>=</mo><msqrt><mn>64</mn></msqrt></math>',
      value: '4',
      rationale: 'Student(s) may have mistaken the exponent of 3 for an exponent of 2.',
    },
  ],
  prompt:
    'Consider the equation <math><msup><mi>a</mi><mn>3</mn></msup><mo>=</mo><mn>64</mn></math>.<br>\n<br>\nPart A:<br>\n<br>\nWhat is the solution to the equation?',
});
