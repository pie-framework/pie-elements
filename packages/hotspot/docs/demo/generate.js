exports.model = (id, element) => ({
  id,
  element,
  prompt: 'This is the question prompt',
  promptEnabled: true,
  imageUrl:
    'https://store-images.s-microsoft.com/image/apps.2544.13768621950225582.167ba0c8-6eb8-47bb-96fe-278c89bf0dc9.ea440c13-fd1d-4705-b62c-9bfd9054b8b3?w=672&h=378&q=80&mode=letterbox&background=%23FFE4E4E4&format=jpg',
  shapes: {
    rectangles: [
      { id: '1', height: 62, width: 54, x: 133, y: 79 },
      { id: '2', height: 109, width: 96, x: 388, y: 140 }
    ],
    polygons: []
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
  outlineList: ['blue', 'red', 'yellow']
});
