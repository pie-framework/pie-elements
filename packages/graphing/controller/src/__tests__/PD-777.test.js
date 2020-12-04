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

const one = {
  request: {
    models: [model('1', 'pie-graphing')],
    elements: {
      'pie-graphing': '@pie-element/graphing@3.4.9',
    },
    env: { mode: 'evaluate' },
    sessions: [
      {
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
      },
      // {
      //   id: "1",
      //   answers: {
      //     1: [true, false],
      //     2: [false, true],
      //     3: [true, false],
      //     4: [false, true],
      //   },
      // },
    ],
  },
  expected: () => ({
    'has id': (r) => expect(r[0].id).toEqual('1'),
    'has body': (r) =>
      expect(r[0]).toMatchObject({ prompt: 'Select correct answers.' }),
  }),
};

module.exports = [one];

describe('PD-777', () => {
  it('fails now', async () => {
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
    const result = await controller.model(model('1', 'pie-graphing'), session, {
      mode: 'evaluate',
    });
  });
});
