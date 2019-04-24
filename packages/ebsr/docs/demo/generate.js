exports.model = (id, element) => ({
  id,
  element,
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
    choicePrefix: 'numbers',
    partialScoring: false,
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
    choicePrefix: 'numbers',
    partialScoring: false,
    prompt: 'What color do you get when you mix Red with your answer in Part 1?',
    shuffle: false,
  },
});
