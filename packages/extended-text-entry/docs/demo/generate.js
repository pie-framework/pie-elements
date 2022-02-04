exports.model = (id, element) => ({
  id,
  element,
  customKeys: [
    '\\square'
  ],
  feedback: { type: 'default', default: 'this is default feedback' },
  prompt: 'This is the question prompt',
  promptEnabled: true,
  mathInput: true,
  playersToolbarPosition: 'bottom',
  toolbarEditorPosition: 'bottom'
});
