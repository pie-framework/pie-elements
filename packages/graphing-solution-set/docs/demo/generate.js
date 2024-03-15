exports.model = (id, element) => ({
  id,
  element,
  answers: {
    correctAnswer: {
      name: 'Correct Answer',
      marks: [],
    },
  },
  arrows: {
    left: true,
    right: true,
    up: true,
    down: true,
  },
  domain: {
    min: -10,
    max: 10,
    padding: 0,
    step: 1,
    labelStep: 1,
    axisLabel: 'x',
  },
  graph: {
    width: 480,
    height: 480,
  },
  gssLineData: {
    numberOfLines: 1,
    selectedTool: 'lineA',
    sections: [],
    lineA: {
      lineType: 'Solid',
    },
  },
  standardGrid: true,
  coordinatesOnHover: false,
  labels: { top: 'top', left: 'left', bottom: 'bottom', right: 'right' },
  padding: true,
  prompt: 'Prompt goes here',
  promptEnabled: true,
  range: {
    min: -10,
    max: 10,
    padding: 0,
    step: 1,
    labelStep: 1,
    axisLabel: 'y',
  },
  rationale: 'Rationale goes here',
  title: 'Graph title',
  rubricEnabled: false,
  language: 'en_US',
});
