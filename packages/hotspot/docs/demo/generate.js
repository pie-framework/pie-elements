exports.model = (id, element) => ({
  id,
  element,
  disabled: false,
  mode: 'gather',
  dimensions: { height: 291, width: 410 },
  imageUrl: 'https://store-images.s-microsoft.com/image/apps.2544.13768621950225582.167ba0c8-6eb8-47bb-96fe-278c89bf0dc9.ea440c13-fd1d-4705-b62c-9bfd9054b8b3?w=672&h=378&q=80&mode=letterbox&background=%23FFE4E4E4&format=jpg',
  hotspotColor: 'rgba(137, 183, 244, 0.65)',
  hotspotList: [
    'rgba(137, 183, 244, 0.65)',
    'rgba(217, 30, 24, 0.65)',
    'rgba(254, 241, 96, 0.65)'
  ],
  outlineColor: 'blue',
  outlineList: ['blue', 'red', 'yellow'],
  multipleCorrect: true,
  shapes: {
    rectangles: [
      {
        id: 'aaa0',
        height: 140,
        width: 130,
        x: 1,
        y: 1,
        correct: true
      }, {
        id: 'd41',
        height: 140,
        width: 130,
        x: 140,
        y: 1
      }, {
        id: 'aaaa42',
        height: 140,
        width: 130,
        x: 280,
        y: 1
      }
    ],
    polygons: [{
      // triangle
      id: '3',
      points: [{ x: 65, y: 148 }, { x: 1, y: 288 }, { y: 288, x: 129 }],
      correct: true
    }, {
      // triangle
      id: 'g74',
      points: [{ y: 151, x: 141 }, { y: 289, x: 205 }, { x: 269, y: 151 }],
      correct: false
    }, {
      // hexagon
      id: 'j35',
      points: [
        { x: 300, y: 150 },
        { x: 279, y: 220 },
        { x: 300, y: 289 },
        { x: 386, y: 289 },
        { x: 407, y: 220 },
        { x: 386, y: 150 }
      ],
      correct: false
    }]
  },
  rationale: null,
  teacherInstructions: null,
  prompt: '<div><audio controls="controls" src="https://storage.googleapis.com/pie-prod-221718-assets/audio/77f3f61e-5f2d-425f-80a5-fb814dfa5e4c"></audio><br><br>Choose ALL of the words with the long /o/ sound.</div>',
});
