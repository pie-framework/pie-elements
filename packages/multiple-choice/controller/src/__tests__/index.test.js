import { model, outcome, getScore } from '../index';
import { isResponseCorrect } from '../utils';

jest.mock('../utils', () => ({
  isResponseCorrect: jest.fn()
}));

describe('controller', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      id: '1',
      element: 'multiple-choice',
      prompt: 'prompt',
      choicePrefix: 'letters',
      choiceMode: 'radio',
      allowFeedback: true,
      choices: [
        {
          label: 'a',
          value: 'apple',
          correct: true,
          feedback: {
            type: 'custom',
            value: 'foo'
          }
        },
        {
          label: 'b',
          value: 'banana',
          feedback: {
            type: 'default'
          }
        }
      ]
    };
  });

  const { stringify } = JSON;

  describe('outcome', () => {
    it('returns score of 0', async () => {
      const result = await outcome(
        question,
        { value: ['banana'] },
        { mode: 'gather' }
      );
      expect(result.score).toEqual(0);
    });

    it('returns score of 1', async () => {
      const result = await outcome(
        question,
        { value: ['apple'] },
        { mode: 'gather' }
      );
      expect(result.score).toEqual(1);
    });

    describe('partial scoring', () => {
      describe('choiceMode:radio is disabled', () => {
        it('with defaults', async () => {
          const result = await outcome(question, {}, {});
          expect(result.score).toEqual(0);
        });
        it('with defaults and correct', async () => {
          const result = await outcome(question, { value: ['apple'] }, {});
          expect(result.score).toEqual(1);
        });
        it('with env.partialScoring: true', async () => {
          const result = await outcome(question, { partialScoring: true }, {});
          expect(result.score).toEqual(0);
        });
        it('with env.partialScoring: true + config.partialScoring: true', async () => {
          const result = await outcome(
            { ...question, partialScoring: true },
            { partialScoring: true },
            {}
          );
          expect(result.score).toEqual(0);
        });
      });

      describe('checkbox', () => {
        beforeEach(() => {
          const choices = question.choices.concat({
            value: 'c',
            correct: true
          });
          question = {
            ...question,
            choiceMode: 'checkbox',
            partialScoring: true,
            choices
          };
        });
        it('returns a score of 0.33', async () => {
          const result = await outcome(question, { value: [] }, { mode: 'evaluate '});
          expect(result.score).toEqual(0.33);
        });

        it('returns score of 0.67', async () => {
          const result = await outcome(
            question,
            { value: ['apple'] },
            { mode: 'gather' }
          );
          expect(result.score).toBeCloseTo(0.67);
        });
      });
    });

    const returnsOutcome = session => {
      it(`returns score: 0 and empty: true if session is ${stringify(session)}`, async () => {
        const o = await outcome(question, session, { mode: 'evaluate' });

        expect(o).toEqual({ score: 0, empty: true });
      });
    };

    returnsOutcome(undefined);
    returnsOutcome(null);
    returnsOutcome({});
  });

  describe('model', () => {
    describe('mode: gather', () => {
      beforeEach(async () => {
        session = {};
        env = { mode: 'gather' };
        result = await model(question, session, env);
      });

      it('returns disabled', () => {
        expect(result.disabled).toEqual(false);
      });

      it('returns mode', () => {
        expect(result.mode).toEqual('gather');
      });

      it('returns prompt', () => {
        expect(result.prompt).toEqual('prompt');
      });

      it('returns choiceMode', () => {
        expect(result.choiceMode).toEqual('radio');
      });

      it('returns choicePrefix', () => {
        expect(result.keyMode).toEqual('letters');
      });

      it('returns complete', () => {
        expect(result.complete).toEqual({ min: 1 });
      });

      it('returns choices', () => {
        expect(result.choices).toEqual(
          expect.arrayContaining([
            { label: 'a', value: 'apple', rationale: null },
            { label: 'b', value: 'banana', rationale: null }
          ])
        );
      });

      it('does not return responseCorrect', () => {
        expect(result.responseCorrect).toBe(undefined);
      });
    });

    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        session = { id: '1', element: 'multiple-choice' };
        env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model(question, session, env, updateSession);
        expect(updateSession).toHaveBeenCalledWith('1', 'multiple-choice', {
          shuffledValues: expect.arrayContaining(['apple', 'banana'])
        });
      });
    });

    describe('mode: view', () => {
      beforeEach(async () => {
        session = {};
        env = { mode: 'view' };
        result = await model(question, session, env);
      });

      it('returns disabled', () => {
        expect(result.disabled).toEqual(true);
      });
    });

    describe('mode: evaluate', () => {
      beforeEach(async () => {
        session = {};
        env = { mode: 'evaluate' };
        isResponseCorrect.mockReturnValue(false);
        result = await model(question, session, env);
        return result;
      });

      it('returns choices w/ correct', () => {
        expect(result.choices).toEqual(
          expect.arrayContaining([
            {
              label: 'a',
              value: 'apple',
              correct: true,
              feedback: 'foo',
              rationale: null
            },
            {
              label: 'b',
              value: 'banana',
              correct: false,
              feedback: 'Incorrect',
              rationale: null
            }
          ])
        );
      });

      it('returns is response correct', () => {
        expect(result.responseCorrect).toEqual(false);
      });

      const returnsCorrectness = sess => {
        it(`returns responseCorrect: false if session is ${stringify(sess)}`, async () => {
          const o = await model(question, sess, env);

          expect(o.responseCorrect).toEqual(false);
        });
      };

      returnsCorrectness(undefined);
      returnsCorrectness(null);
      returnsCorrectness({});
    });
  });

  describe('getScore', () => {
    const returnsScore = sess => {
      it(`returns score: 0 if session is ${stringify(sess)}`,  () => {
        const score = getScore(question, sess);

        expect(score).toEqual(0);
      });
    };

    returnsScore(undefined);
    returnsScore(null);
    returnsScore({});
  });
});
