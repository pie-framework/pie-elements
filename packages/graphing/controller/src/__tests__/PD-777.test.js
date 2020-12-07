import * as controller from '../index';

const model = (id, element) => ({
  domain: { min: -1, step: 1, axisLabel: 'X', max: 12, labelStep: 1 },
  graph: { height: 500, width: 500 },
  element,
  id,
  toolbarTools: ['move', 'ray'],
  answers: {
    correctAnswer: {
      marks: [{ from: { y: 0, x: 0 }, to: { x: 10, y: 30 }, type: 'ray' }],
    },
  },
  range: { axisLabel: 'Y', min: -1, max: 33, labelStep: 2, step: 2 },
  title: 'Cost of Gasoline ',
  labels: { bottom: 'Number of Gallons ', left: 'Cost of Gasoline ($)' },
  prompt: 'prompt',
});

describe('PD-777', () => {
  it('should return result for session w/ incomplete marks', async () => {
    const session = {
      id: '1',
      element: 'pie-graphing',
      answer: [
        {
          to: { x: 4, y: 12 },
          type: 'ray',
          from: { x: 2, y: 6 },
          building: false,
        },
        {
          type: 'ray',
          to: { y: 24, x: 8 },
          building: false,
          from: { y: 18, x: 6 },
        },
        {
          to: { y: 6, x: 2 },
          building: false,
          type: 'ray',
          from: { x: 11, y: 30 },
        },
        {
          from: { x: 0, y: 0 },
          type: 'ray',
          building: true,
        },
      ],
    };
    const result = await controller.model(model('2', 'pie-graphing'), session, {
      mode: 'evaluate',
    });
  });
});
