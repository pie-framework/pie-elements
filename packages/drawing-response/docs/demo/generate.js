exports.model = (id, element) => ({
  id,
  element,
  prompt: 'This is the question prompt',
  promptEnabled: true,
  toolbarEditorPosition: 'top',
  imageUrl: '',
  imageDimensions: {
    height: 0,
    width: 0
  }
});
