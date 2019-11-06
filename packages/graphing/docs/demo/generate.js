exports.model = (id, element) => ({
  id,
  element,
  answers: {
    correctAnswer: {
      name: 'Correct Answer',
      marks: [{
        type: 'point',
        x: 0,
        y: 0
      }]
    },
    alternate1: {
      name: 'Alternate 1',
      marks: [{
        type: 'segment',
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
      },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point',
          showLabel: true
        }]
    }
  },
  arrows: true,
  backgroundMarks: [
    {
      type: 'point',
      x: 2,
      y: 2,
      label: 'Point',
      showLabel: true
    }
  ],
  domain: {
    min: -10,
    max: 10,
    padding: 0,
    step: 1,
    labelStep: 1,
    axisLabel: 'x'
  },
  graph: {
    width: 480,
    height: 480
  },
  labels: {top: 'top', left: 'left', bottom: 'bottom', right: 'right'},
  padding: true,
  prompt: 'Here goes item stem !!!!!!',
  promptEnabled: true,
  range: {
    min: -5,
    max: 5,
    padding: 0,
    step: 1,
    labelStep: 1,
    axisLabel: 'y'
  },
  rationale: 'Rationale goes here',
  title: 'Graph title',
});
