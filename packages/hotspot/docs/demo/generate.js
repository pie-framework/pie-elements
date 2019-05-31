exports.model = (id, element) => ({
  id,
  element,
  prompt: 'This is the question prompt',
  imageUrl: '',
  shapes: {
    rectangles: [],
    polygons: [{
      correct: true,
      id: 'polygon1',
      points: [
        {
          x: 23,
          y: 20
        },
        {
          x: 23,
          y: 160
        },
        {
          x: 70,
          y: 93
        },
        {
          x: 150,
          y: 109
        },
        {
          x: 170,
          y: 139
        },
        {
          x: 150,
          y: 93
        }
      ]
    }, {
      correct: false,
      id: 'polygon2',
      points: [
        {
          x: 26,
          y: 172
        },
        {
          x: 153,
          y: 136
        },
        {
          x: 140,
          y: 188
        },
        {
          x: 111,
          y: 188
        },
      ]
    }]
  },
  multipleCorrect: true,
  partialScoring: false,
  dimensions: {
    height: 0,
    width: 0
  },
  hotspotColor: 'rgba(137, 183, 244, 0.65)',
  hotspotList: [
    'rgba(137, 183, 244, 0.65)',
    'rgba(217, 30, 24, 0.65)',
    'rgba(254, 241, 96, 0.65)'
  ],
  outlineColor: 'blue',
  outlineList: [
    'blue',
    'red',
    'yellow'
  ]
});
