import { model, outcome } from '../index';

const prompt = (id, relatedAnswer) => ({
  id,
  title: `Prompt ${id}`,
  relatedAnswer
});

const answer = (id) => ({
  id,
  title: `Answer ${id}`
});

describe('controller', () => {
  let question, session, env;

  beforeEach(() => {
    question = {
      id: '1',
      element: 'match-list',
      prompts: [prompt(1, 1), prompt(2, 2)],
      answers: [answer(3), answer(4), answer(5)],
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
        headers: ['Column 1', 'Column 2', 'Column 3']
      }
    };
  });

  describe('model', () => {
    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        session = { id: '1', element: 'match-list' };
        env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model(question, session, env, updateSession);
        expect(updateSession).toHaveBeenCalledWith('1', 'match-list', {
          shuffledValues: expect.arrayContaining([1, 2], [3, 4, 5, 6])
        });
      });
    });

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
});

