exports.model = (id, element) => ({
  id,
  element,
  multiple: false,
  partialScoring: false,
  partialScoringRules: [],
  rationale: 'Rationale goes here',
  feedback: {
    correct: {
      type: 'none',
      default: 'Correct'
    },
    partial: {
      type: 'none',
      default: 'Nearly'
    },
    incorrect: {
      type: 'none',
      default: 'Incorrect'
    }
  },
  answers: {
    correctAnswer: {
      name: 'Correct Answer',
      marks: [{
        type: 'segment',
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
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
  }
});
