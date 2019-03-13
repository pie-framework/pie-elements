exports.model = (id, element) => ({
  id,
  element,
  keyMode: 'numbers',
  labelMode: 'numbers',
  sequentialLabel: false,
  lockChoiceOrder: false,
  partA: {
    prompt: 'What color is the sky?',
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
    ]
  },
  partB: {
    prompt: 'What color do you get when you mix Red with your answer in Part 1?',
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
    ]
  },
});
