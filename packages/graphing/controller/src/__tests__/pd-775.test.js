import * as controller from '../index';

const model = (id, element) => ({
  id,
  element,
  answers: {
    correctAnswer: {
      marks: [
        {
          type: 'line',
          from: {
            y: 0,
            x: 0,
          },
          to: {
            y: 120,
            x: 4,
          },
        },
      ],
    },
  },
  teacherInstructions: '',
  range: {
    step: 15,
    max: 128,
    labelStep: 15,
    min: -8,
    axisLabel: 'Y',
  },
  domain: {
    labelStep: 1,
    step: 1,
    axisLabel: 'X',
    max: 9,
    min: -1,
  },
  labels: {
    left: 'd',
    bottom: 't',
  },
  graph: {
    height: 500,
    width: 500,
  },
  prompt: 'prompt',
  rationale: '<div></div>',
  title: 'Distance a Horse Galloped',
  toolbarTools: ['move', 'line'],
});

describe('PD-775', () => {
  it('fails now', async () => {
    const session = {
      id: '1',
      element: 'pie-graphing',
      answer: [
        {
          type: 'line',
          to: {
            y: 0,
            x: 0,
          },
          building: false,
          from: {
            y: 60,
            x: 2,
          },
        },
        {
          to: {
            y: 90,
            x: 3,
          },
          type: 'line',
          building: false,
          from: {
            y: 30,
            x: 1,
          },
        },
        {
          from: {
            y: 120,
            x: 4,
          },
          type: 'line',
          building: true,
        },
      ],
    };
    const result = await controller.model(model('1', 'pie-graphing'), session, {
      mode: 'evaluate',
    });
    console.log('result:', result);
  });
});
