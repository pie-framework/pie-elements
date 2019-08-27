import { model, outcome } from '../index';

const question = {
  config: {
    rows: [
      {
        id: 1,
        title: 'Question Text 1',
        values: [false, false]
      },
      {
        id: 2,
        title: 'Question Text 2',
        values: [false, false]
      },
    ],
    layout: 3,
    headers: ['Column 1', 'Column 2', 'Column 3'],
  }
};

describe('model', () => {
  describe('mode: evaluate', () => {
    const returnCorrectness = session => {
      it(`returns correctness and score: 0 if session is ${JSON.stringify(session)}`, async () => {
        const m = await model(question, session, { mode: 'evaluate' });

        expect(m).toEqual(expect.objectContaining({
          correctness: {
            correctness: 'unanswered',
            score: '0%'
          }
        }));
      });
    };

    returnCorrectness(undefined);
    returnCorrectness(null);
    returnCorrectness({});
  });
});

describe('outcome', () => {
  describe('mode: evaluate', () => {
    const returnOutcome = session => {
      it(`returns empty: true and score: 0 if session is ${JSON.stringify(session)}`, async () => {
        const o = await outcome(question, session, { mode: 'evaluate' });

        expect(o).toEqual(expect.objectContaining({
          score: 0,
          empty: true
        }));
      });
    };

    returnOutcome(undefined);
    returnOutcome(null);
    returnOutcome({});
  });
});