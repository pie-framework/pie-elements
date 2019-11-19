exports.model = (id, element) => ({
  id,
  element,
  answers: {
    correctAnswer: {
      name: 'Correct Answer',
      marks: [
        {
          type: 'point',
          x: 0,
          y: 0
        }
      ]
    },
    alternate1: {
      name: 'Alternate 1',
      marks: [
        {
          type: 'segment',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 }
        },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point',
          showLabel: true
        }
      ]
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
  title: 'Graph title'
});

const l = (id, element) => ({
  id,
  element,
  graph: {
    height: 500,
    width: 500
  },
  answers: {
    correctAnswer: {
      marks: [
        {
          y: 3,
          x: 6,
          type: 'point',
          label: 'P'
        },
        {
          x: -2,
          type: 'point',
          y: 7,
          label: 'Q'
        },
        {
          y: 0,
          x: 2,
          type: 'point',
          label: 'R'
        }
        // {
        //   type: 'lrnlabel'
        // },
        // {
        //   type: 'lrnlabel'
        // },
        // {
        //   type: 'lrnlabel'
        // }
      ]
    }
  },
  toolbarTools: ['point', 'label'],
  range: {
    min: -11,
    axisLabel: '<i>y</i>',
    max: 10,
    labelStep: 5,
    step: 1
  },
  rationale:
    '<p>The correct response is:</p><p><img alt="image 5ccf4fe0daf9484986d1b7327a412041" id="5ccf4fe0daf9484986d1b7327a412041" src="https://storage.googleapis.com/pie-staging-221718-assets/image/84d84525-2355-4b1e-a694-843c91ff5143"></p>',
  prompt:
    '<p>Graph the points listed below in the coordinate grid and label each one with its letter name.</p><ul><li><i>A</i>(–2, 7)</li><li><i>B</i>(2, 0)</li><li><i>C</i>(6, 3)</li></ul><p><span class="variable">To graph a point, make sure the “Point” button is highlighted. On the coordinate grid, find a point on the line and click on that point, then repeat the process for all the points. Once the point is graphed, click on the “Label” button then click on the point you want to label. Type the label in the blank box. Repeat this process until all the points are labeled.</span></p>',
  domain: {
    min: -11,
    axisLabel: '<i>x</i>',
    max: 10,
    labelStep: 5,
    step: 1
  }
});
exports.model = l;
