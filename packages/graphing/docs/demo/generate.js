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

const E491880 = {
  'backgroundMarks': [
    {
      'closed': true,
      'type': 'polygon',
      'points': [
        {
          'x': 3,
          'y': 11
        },
        {
          'x': 3,
          'y': 5
        },
        {
          'x': 12,
          'y': 5
        },
        {
          'x': 12,
          'y': 11
        }
      ]
    }
  ],
  'domain': {
    'min': 1.4,
    'max': 13.4,
    'labelStep': 1,
    'step': 1
  },
  'range': {
    'min': 1.4,
    'max': 13.4,
    'labelStep': 1,
    'step': 1
  },
  'toolbarTools': [
    'segment',
    'polygon'
  ],
  'prompt': '<p>Divide and shade the shape below to show&#160;<math> <mrow> <mfrac> <mn>1</mn> <mn>3</mn> </mfrac> </mrow> </math>.</p>\n\n<p><em>Use the segment tool to divide the shape. Click on any two points to make a line segment. You can drag the ends of the segment if you need to move it. Once you have finished dividing the shape, you can start to shade the section(s). Choose the polygon tool. Click on a&#160;corner of the section&#160;you want to shade and continue to click on each corner&#160;of that section. The section will become shaded when you click on the corner where you started. Shade any section(s) you need to so that your picture represents</em><math> <mrow> <mfrac> <mn>1</mn> <mn>3</mn> </mfrac> </mrow> </math>.</p>\n',
  'graph': {
    'width': 500,
    'height': 500
  },
};

exports.model = (id, element) => ({
  id,
  element,
  ...E491880
});
