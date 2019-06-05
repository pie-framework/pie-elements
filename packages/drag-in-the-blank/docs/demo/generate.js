const choice = (v, id) => ({ value: v, id });

const markup = '<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>';

exports.model = (id, element) => ({
  id,
  element,
  disabled: false,
  markup: markup,
  choices: [
    choice('cow', '0'),
    choice('over', '1'),
    choice('moon', '2'),
    choice('cattle', '3'),
    choice('calf', '4'),
    choice('past', '5'),
    choice('beyond', '6'),
    choice('satellite', '7')
  ],
  correctResponse: {
    0: '0',
    1: '1',
    2: '2'
  },
  duplicates: false,
  prompt: 'Use the dropdowns to complete the sentence'
});
