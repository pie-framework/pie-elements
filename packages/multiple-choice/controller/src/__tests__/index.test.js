import { model, outcome, scoreFromRule, partialScoring } from '../index';
import { isResponseCorrect } from '../utils';
import _ from 'lodash';

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
          const result = await outcome(question, {}, {});
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
