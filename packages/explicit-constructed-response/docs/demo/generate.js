const choice = (l, v) => ({ label: l, value: v });

const markup = '<p>The {{0}} <br> jumped {{1}} <br> the {{2}}</p>';

exports.model = (id, element) => ({
  id,
  element,
  markup,
  disabled: false,
  choices: {
    0: [choice('cow', '0'), choice('cattle', '1'), choice('calf', '2')],
    1: [choice('over', '0'), choice('past', '1'), choice('beyond', '2')],
    2: [choice('moon', '0')],
  },
  maxLengthPerChoice: [7, 10, 4],
  prompt: 'Complete the sentence',
  promptEnabled: true,
  toolbarEditorPosition: 'bottom',
  rubricEnabled: false,
});
