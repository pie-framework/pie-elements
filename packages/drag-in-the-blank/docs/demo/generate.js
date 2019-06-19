const choice = (v, id) => ({ value: v, id });

const markup = '<div> {{0}}    {{1}}    {{2}}    {{3}}  </div>';

exports.model = (id, element) => ({
  id,
  element,
  disabled: false,
  markup: markup,
  choices: [
    choice('True', '0'),
    choice('False', '1')
  ],
  correctResponse: {
    0: '0',
    1: '1',
    2: '1',
    3: '0'
  },
  alternateResponses: {
    0: ['1']
  },
  choicesPosition: 'left',
  duplicates: true,
  prompt: 'Use the dropdowns to complete the sentence',
  shuffle: true
});
