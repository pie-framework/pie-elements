exports.model = (id, element) => ({
  id,
  element,
  prompt: 'This is the question prompt',
  partA: {
    choiceMode: 'radio',
    choices: [
      {
        value: 'yellow',
        label: 'Yellow',
      },
      {
        value: 'green',
        label: 'Green',
      },
      {
        correct: true,
        value: 'blue',
        label: 'Blue',
      },
    ],
    keyMode: 'numbers',
    partialScoring: false,
    partialScoringLabel: `Each correct response that is correctly checked and each incorrect response
          that is correctly unchecked will be worth 1 point.
          The maximum points is the total number of answer choices.`,
    prompt: 'What color is the sky?',
    shuffle: false,
    showCorrect: false,
  },
  partB: {
    choiceMode: 'radio',
    choices: [
      {
        value: 'orange',
        label: 'Orange',
      },
      {
        correct: true,
        value: 'purple',
        label: 'Purple',
      },
      {
        value: 'pink',
        label: 'Pink',
      },
      {
        value: 'green',
        label: 'Green',
      },
    ],
    keyMode: 'numbers',
    partialScoring: false,
    partialScoringLabel: `Each correct response that is correctly checked and each incorrect response
          that is correctly unchecked will be worth 1 point.
          The maximum points is the total number of answer choices.`,
    prompt: 'What color do you get when you mix Red with your answer in Part 1?',
    shuffle: false,
  },
});
