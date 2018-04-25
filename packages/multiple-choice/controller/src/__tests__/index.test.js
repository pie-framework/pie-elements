import { model } from '../index';
import { isResponseCorrect } from '../utils';

jest.mock('../utils', () => ({
  isResponseCorrect: jest.fn()
}));

describe('model', () => {
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
