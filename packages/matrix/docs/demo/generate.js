exports.model = (id, element) => ({
  id,
  element,
  labelType: 'agreement',
  rowLabels: ['I\'m interested in politics.', 'I\'m interested in economics.'],
  columnLabels: ['Disagree', 'Unsure', 'Agree'],
  matrixValues: {},
  prompt: 'How interested are you in the following domains?'
});
