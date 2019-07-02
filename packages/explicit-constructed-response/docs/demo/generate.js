const choice = (l, v) => ({ label: l, id: v });

const markup = '<p>The {{0}} jumped {{1}} the {{2}}</p>';

exports.model = (id, element) => ({
  id,
  element,
  markup,
  disabled: false,
  choices: {
    0: [choice('cow', '0'), choice('cattle', '1'), choice('calf', '2')],
    1: [choice('over', '0'), choice('past', '1'), choice('beyond', '2')],
    2: [choice('moon', '0')]
  },
  prompt: 'Use the dropdowns to complete the sentence'
});
