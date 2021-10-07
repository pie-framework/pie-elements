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
    2: [choice('moon', '0')]
  },
  maxChoicesLength: [6, 6, 4],
  prompt: 'Complete the sentence',
  note: 'The answer shown above is the most common correct answer for this item. One or more additional correct answers are also defined, and will also be recognized as correct.',
  promptEnabled: true,
  toolbarEditorPosition: 'bottom'
});
