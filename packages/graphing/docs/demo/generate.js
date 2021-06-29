// const E259702 = {
//   domain: {
//     min: -11,
//     axisLabel: '<i>x</i>',
//     max: 11,
//     labelStep: 1,
//     step: 1
//   },
//   id: '000000005407608c0154340bf94c2e46',
//   graph: {
//     height: 500,
//     width: 500
//   },
//   answers: {
//     correctAnswer: {
//       marks: [
//         {
//           closed: true,
//           points: [
//             {
//               y: 4,
//               x: -5
//             },
//             {
//               x: 3,
//               y: 6
//             },
//             {
//               y: -4,
//               x: 2
//             }
//           ],
//           type: 'polygon'
//         }
//       ]
//     }
//   },
//   toolbarTools: ['polygon'],
//   element: 'pie-element-graphing',
//   range: {
//     min: -11,
//     axisLabel: '<i>y</i>',
//     max: 11,
//     labelStep: 1,
//     step: 1
//   },
//   rationale: '<p>A correct response is shown below:</p><p><img alt=\'image 21d436190c7a432298ef8f3484984a8b\' id=\'21d436190c7a432298ef8f3484984a8b\' src=\'https://storage.googleapis.com/pie-prod-221718-assets/image/0089abe1-e891-4ab0-be73-859fec9f4fa4\'></p>',
//   prompt: '<p>Consider these ordered pairs.</p><ul><li>Point <span class=\'variable\'>X</span>: (3, 6)</li><li>Point <span class=\'variable\'>Y</span>: (2, &#8211;4)</li><li>Point <span class=\'variable\'>Z</span>: (&#8211;5, 4)</li></ul><p>Plot these points on the coordinate grid below to form triangle <span class=\'variable\'>XYZ</span>.</p><p><em style=\'font-style: italic;\'>To graph the shape on the coordinate grid, click on a point that represents a vertex, then repeat this process for each vertex point of the shape. To complete the shape, click on the first vertex point. The shape will be shaded in once it is completed.</em></p>'
// };
//
// const E195666 = {
//   element: 'pie-element-graphing',
//   range: {
//     min: -1,
//     max: 21,
//     labelStep: 1,
//     step: 1
//   },
//   rationale: '<p>See Rubric.&#160;</p>',
//   prompt: '<p>An ant is 18 meters (m) from his ant hill. He walks about 5 meters per minute directly toward the ant hill. Graph the line on the coordinate grid below&#160;which shows how far the ant is from the ant hill after walking any&#160;number of minutes. Use the <span class=\'variable\'>x</span>-axis to represent the number of minutes and the <span class=\'variable\'>y</span>-axis to represent the distance from the ant hill in meters.</p>',
//   teacherInstructions: '',
//   labels: {
//     bottom: 'Minutes',
//     left: 'Meters'
//   },
//   domain: {
//     step: 1,
//     min: -1,
//     max: 21,
//     labelStep: 1
//   },
//   id: '4028e4a24140911d01414d8b3dd81cdb',
//   graph: {
//     width: 500,
//     height: 500
//   },
//   toolbarTools: ['line']
// };

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
  arrows: {
    left: true,
    right: true,
    up: true,
    down: true
  },
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
  labels: { top: 'top', left: 'left', bottom: 'bottom', right: 'right' },
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
