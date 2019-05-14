export default {
  model: {
    prompt: 'This is the question prompt',
    imageUrl: '',
    shapes: [],
    multipleCorrect: true,
    partialScoring: false,
    dimensions: {
      height: 0,
      width: 0
    },
    hotspotColor: 'rgba(137, 183, 244, 0.65)',
    hotspotList: [
      'rgba(137, 183, 244, 0.65)'
    ],
    outlineColor: 'blue',
    outlineList: [
      'blue'
    ]
  },
  configuration: {
    multipleCorrect: {
      settings: true,
      label: 'Multiple Correct Responses'
    },
    partialScoring: {
      settings: true,
      label: 'Allow Partial Scoring'
    },
  }
};
