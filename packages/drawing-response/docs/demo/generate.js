exports.model = (id, element) => ({
  id,
  element,
  prompt: 'This is the question prompt',
  promptEnabled: true,
  backgroundImageEnabled: true,
  toolbarEditorPosition: 'bottom',
  imageUrl: '',
  imageDimensions: {
    height: 0,
    width: 0,
  },
  rubricEnabled: false,
});
