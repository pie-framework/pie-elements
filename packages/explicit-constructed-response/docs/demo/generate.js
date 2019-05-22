const choice = (l, v) => ({ label: l, id: v });

const markup = '<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>';

exports.model = (id, element) => ({
  id,
  element,
  disabled: false,
  markup: markup,
  choices: {
    0: [choice('cow', '0'), choice('cattle', '1'), choice('calf', '2')],
    1: [choice('over', '0'), choice('past', '1'), choice('beyond', '2')],
    2: [choice('moon', '0')],
    3: [choice('bun', '0')],
  },
  prompt: 'Use the dropdowns to complete the sentence'
});
