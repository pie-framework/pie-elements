import { model, outcome, getCorrectness, getScore, getTotalScore } from '../index';
import { buildState, score } from '@pie-lib/categorize';

const categorize = require('@pie-lib/categorize');

const categories = () => [{ id: '1', label: 'One' }];

const choices = () => [{ id: '1', content: 'Foo' }, { id: '2', content: 'Bar' }];

describe('controller', () => {
  let question;
  let result;
  const buildStateSpy = jest.spyOn(categorize, 'buildState');

  beforeEach(() => {
    question = {
      categories: categories(),
      choices: choices(),
      correctResponse: [{ category: '1', choices: ['1', '2'] }],
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

      it('resolves incorrect if session undefined', () => {
        expect(getCorrectness(
          question,
          undefined,
          {
            mode: 'evaluate'
          }
        )).resolves.toEqual('incorrect');
      });

      it('resolves incorrect if session is null', () => {
        expect(getCorrectness(
          question,
          null,
          {
            mode: 'evaluate'
          }
        )).resolves.toEqual('incorrect');
      });

      it('resolves incorrect if session is empty', () => {
        expect(getCorrectness(
          question,
          {},
          {
            mode: 'evaluate'
          }
        )).resolves.toEqual('incorrect');
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
          { ...question, partialScoring: true },
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

      it ('returns empty: false when session is defined', async () => {
        expect(await outcome(question, { id: 1 }, { mode: 'evaluate' }))
          .toEqual({ score: 0, empty: false });
      });

      it ('returns empty: true when session undefined', async () => {
        expect(await outcome(question, undefined, { mode: 'evaluate' }))
          .toEqual({ score: 0, empty: true});
      });

      it ('returns empty: true when session null', async () => {
        expect(await outcome(question, null, { mode: 'evaluate' }))
          .toEqual({ score: 0, empty: true});
      });

      it ('returns empty: true when session empty', async () => {
        expect(await outcome(question, {}, { mode: 'evaluate' }))
          .toEqual({ score: 0, empty: true});
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

  describe('getScore', () => {
    it('returns correct result', () => {
      expect(getScore(
        { id: '0' },
        [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }],
        ['0', '1', '3'],
        ['0', '2']
      )).toEqual(0.25);

      expect(getScore(
        { id: '0' },
        [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }],
        ['0'],
        ['0', '2']
      )).toEqual(0.75);
    });
  });

  describe('getTotalScore', () => {
    it('returns 0 if session is undefined', () => {
      expect(getTotalScore(question, undefined)).toEqual(0);
    });

    it('returns 0 if session is null', () => {
      expect(getTotalScore(question, null)).toEqual(0);
    });

    it('returns 0 if session is empty', () => {
      expect(getTotalScore(question, {})).toEqual(0);
    });
  });

});
