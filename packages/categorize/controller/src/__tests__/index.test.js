import { model, outcome, getCorrectness } from '../index';
import { buildState, score } from '@pie-lib/categorize';

const categorize = require('@pie-lib/categorize');

const categories = () => [{ id: '1', label: 'One' }];

const choices = () => [{ id: '1', content: 'Foo' }, { id: '2', content: 'Bar' }];

describe('controller', () => {
  let question;
  let result;
  const scoreSpy = jest.spyOn(categorize, 'score');
  const buildStateSpy = jest.spyOn(categorize, 'buildState');

  beforeEach(() => {
    question = {
      categories: categories(),
      choices: choices(),
      correctResponse: [{ category: '1', choices: ['1', '2'] }],
      scoring: {
        weighting: {
          enabled: true,
          rules: [{ category: '1', points: 1 }, { category: '2', points: 1 }]
        },
        partial: {
          enabled: true,
          rules: [
            {
              category: '1',
              rules: [{ count: 1, percent: 50 }, { count: 2, percent: 100 }]
            },
            { category: '2', rules: [] }
          ]
        }
      }
    };
  });

  describe('getCorrectness', () => {
    describe('mode: gather', () => {
      it('resolves undefined', () => {
        expect(getCorrectness(question, {}, { mode: 'gather' })).resolves.toEqual(undefined);
      });
    });

    describe('mode: view', () => {
      it('resolves undefined', () => {
        expect(getCorrectness(question, {}, { mode: 'gather' })).resolves.toEqual(undefined);
      });
    });

    describe('mode: evaluate', () => {
      let correctness;

      beforeEach(() => {
        correctness = getCorrectness(question, {}, { mode: 'evaluate' });
      });

      it('calls buildState ', () => {
        expect(buildStateSpy).toBeCalled();
      });

      it('calls score ', () => {
        expect(scoreSpy).toHaveBeenCalled();
      });

      it('resolves incorrect', () => {
        expect(getCorrectness(
          question,
          {},
          {
            mode: 'evaluate'
          }
        )).resolves.toEqual('incorrect');
      });

      it('resolves correct', () => {
        expect(getCorrectness(
          question,
          {
            answers: [
              {
                category: '1',
                choices: ['1', '2']
              }
            ]
          },
          {
            mode: 'evaluate'
          }
        )).resolves.toEqual('correct');
      });

      it('resolves partially-correct', () => {
        expect(getCorrectness(
          question,
          {
            answers: [
              {
                category: '1',
                choices: ['1']
              }
            ]
          },
          {
            mode: 'evaluate'
          }
        )).resolves.toEqual('partially-correct');
      });
    });
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
        expect(buildStateSpy).toBeCalled();
      });
      it('calls score ', () => {
        expect(scoreSpy).toHaveBeenCalled();
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
        correctResponse: [{ category: '1', choices: ['1', '2'] }]
      });
    });

    it('adds default config', async () => {
      const result = await model(question, {}, { mode: 'gather' });
      expect(result).toMatchObject({
        choicesPerRow: 2,
        categoriesPerRow: 2,
        choicesLabel: '',
      });
    });
  });
});
