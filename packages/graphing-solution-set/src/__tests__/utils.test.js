import { removeInvalidAnswers } from '../utils';

describe('removeInvalidAnswers', () => {
  test.each([
    [undefined, []],
    [null, []],
    [[], []],
    [
      [
        { type: 'line' },
        { type: 'line', from: null, to: null },
        { type: 'line', from: {}, to: {} },
        { type: 'line', from: null, to: { x: 'a', y: NaN } },
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
        { type: 'line', to: { x: 0, y: 0 } },
        { type: 'polygon' },
        { type: 'polygon', points: null },
        { type: 'polygon', points: [] },
        { type: 'polygon', points: [{}] },
        { type: 'polygon', points: [{ x: 1, a: 'v' }] },
        { type: 'polygon', points: [{ x: 1, y: 'v' }] },
        { type: 'polygon', points: [{ x: NaN, y: 'v' }] },
        { type: 'polygon', points: [{ x: 0, y: 0 }] },
        { type: 'polygon', points: [{ x: 0, y: 0 }, {}] },
      ],
      [
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
        { type: 'polygon', points: [{ x: 0, y: 0 }] },
      ],
    ],
  ])('answers: %j, only valid answers: %j', (answers, validAnswers) => {
    expect(removeInvalidAnswers(answers)).toEqual(validAnswers);
  });
});
