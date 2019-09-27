exports.model = (id, element) => ({
  id,
  element,
  enableImages: true,
  feedback: {
    correct: {
      type: 'none',
      default: 'Correct'
    },
    partial: {
      type: 'none',
      default: 'Nearly'
    },
    incorrect: {
      type: 'none',
      default: 'Incorrect'
    }
  },
  headers: ['Column 1', 'Column 2', 'Column 3'],
  layout: 3,
  lockChoiceOrder: true,
  partialScoring: false,
  choiceMode: 'radio',
  rows: [
    {
      id: 1,
      title: 'Question Text 1',
      values: [false, false]
    },
    {
      id: 2,
      title: 'Question Text 2',
      values: [false, false]
    },
    {
      id: 3,
      title: 'Question Text 3',
      values: [false, false]
    },
    {
      id: 4,
      title: 'Question Text 4',
      values: [false, false]
    }
  ],
  promptEnabled: true,
  prompt: 'Select correct answers.',
});
