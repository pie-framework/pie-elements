import { model, outcome, scoreFromRule } from '../index';
import { isResponseCorrect } from '../utils';

jest.mock('../utils', () => ({
  isResponseCorrect: jest.fn()
}));

describe('controller', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      prompt: 'prompt',
      keyMode: 'letters',
      choiceMode: 'radio',
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

  describe('scoreFromRule', () => {
    const assertScoreFromRule = (scorePercentage, expected, fallback) => {
      it(`${scorePercentage} (fallback: ${fallback}) => ${expected}`, () => {
        const result = scoreFromRule(
          scorePercentage ? { scorePercentage } : null,
          fallback
        );
        expect(result).toBeCloseTo(expected, 8);
      });
    };
    assertScoreFromRule(80, 0.8);
    assertScoreFromRule(70, 0.7);
    assertScoreFromRule(null, 0.75, 0.75);
  });

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
      beforeEach(() => {
        const choices = question.choices.concat({ value: 'c', correct: true });
        question = {
          ...question,
          partialScoring: [{ numberOfCorrect: 1, scorePercentage: 34.5 }],
          choices
        };
      });

      it('returns a score of 0', async () => {
        const result = await outcome(question, {}, {});
        expect(result.score).toEqual(0);
      });

      it('returns score of 0.345', async () => {
        const result = await outcome(
          question,
          { value: ['apple'] },
          { mode: 'gather' }
        );
        expect(result.score).toBeCloseTo(0.345);
      });
    });
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

      it('returns keyMode', () => {
        expect(result.keyMode).toEqual('letters');
      });

      it('returns complete', () => {
        expect(result.complete).toEqual({ min: 1 });
      });

      it('returns choices', () => {
        expect(result.choices).toEqual([
          { label: 'a', value: 'apple' },
          { label: 'b', value: 'banana' }
        ]);
      });

      it('does not return responseCorrect', () => {
        expect(result.responseCorrect).toBe(undefined);
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
        expect(result.choices).toEqual([
          { label: 'a', value: 'apple', correct: true, feedback: 'foo' },
          { label: 'b', value: 'banana', correct: false, feedback: 'Incorrect' }
        ]);
      });

      it('returns is response correct', () => {
        expect(result.responseCorrect).toEqual(false);
      });
    });
  });
});
