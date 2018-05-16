import { model, outcome } from '../index';
import { buildState, score } from '@pie-lib/categorize';

const categories = () => [{ id: '1', label: 'One' }];

const choices = () => [{ id: '1', content: 'Foo' }];

jest.mock('@pie-lib/categorize', () => {
  return {
    buildState: jest.fn(o => o),
    score: jest.fn().mockReturnValue(Promise.resolve({ score: 1 }))
  };
});

describe('controller', () => {
  let question;
  let result;

  beforeEach(() => {
    question = {
      categories: categories(),
      choices: choices(),
      correctResponse: [{ category: '1', choices: ['1'] }]
    };
  });

  describe('outcome', () => {
    describe('mode: gather', () => {
      it('rejects with an error for gather', () => {
        expect(outcome(question, {}, { mode: 'gather' })).rejects.toEqual(
          expect.any(Error)
        );
      });
    });

    describe('mode: view', () => {
      it('rejects with an error for gather', () => {
        expect(outcome(question, {}, { mode: 'view' })).rejects.toEqual(
          expect.any(Error)
        );
      });
    });

    describe('mode: evaluate', () => {
      beforeEach(() => {
        outcome(question, {}, { mode: 'evaluate' });
      });
      it('calls buildState ', () => {
        expect(buildState).toBeCalled();
      });
      it('calls score ', () => {
        expect(score).toBeCalled();
      });
    });
  });

  describe('model', () => {
    it('returns model', async () => {
      const result = await model(question, {}, { mode: 'gather' });
      expect(result).toMatchObject({ ...question, correctResponse: undefined });
    });

    describe('disabled', () => {
      it('disabled false for gather', async () => {
        const result = await model(question, {}, { mode: 'gather' });
        expect(result).toMatchObject({ disabled: false });
      });

      it('disabled true for view', async () => {
        const result = await model(question, {}, { mode: 'view' });
        expect(result).toMatchObject({ disabled: true });
      });

      it('disabled true for evaluate', async () => {
        const result = await model(question, {}, { mode: 'evaluate' });
        expect(result).toMatchObject({ disabled: true });
      });
    });

    it('adds correctResponse for evaluate', async () => {
      const result = await model(question, {}, { mode: 'evaluate' });
      expect(result).toMatchObject({
        correctResponse: [{ category: '1', choices: ['1'] }]
      });
    });

    it('adds default config', async () => {
      const result = await model(question, {}, { mode: 'gather' });
      expect(result).toMatchObject({
        config: {
          choices: {
            columns: 2
          },
          categories: {
            columns: 2
          }
        }
      });
    });
  });
});
