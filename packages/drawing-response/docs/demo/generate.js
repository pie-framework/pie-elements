exports.model = (id, element) => ({
  id,
  element,
  prompt: 'This is the question prompt',
  promptEnabled: true,
  imageUrl: '',
  imageDimensions: {
    height: 0,
    width: 0
  }
});
