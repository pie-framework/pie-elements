import { model, outcome, scoreFromRule, partialScoring } from '../index';
import { isResponseCorrect } from '../utils';

jest.mock('../utils', () => ({
  isResponseCorrect: jest.fn()
}));

jest.mock('@pie-lib/controller-utils', () => ({
  partialScoring: {
    enabled: config => config.partialScoring
  }
}));

describe('controller', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      prompt: 'prompt',
      imageUrl: '',
      dimensions: {
        height: 0,
        width: 0
      },
      outlineColor: 'blue',
      hotspotColor: 'lightblue',
      shapes: [
        {
          id: '1',
          correct: true
        },
        {
          id: '2',
        },
        {
          id: '3',
        }
      ],
      multipleCorrect: true,
      partialScoring: false
    };
  });

  describe('outcome', () => {
    it('returns score of 0', async () => {
      const result = await outcome(
        question,
        { answers: [{ id: '2' }] }
      );
      expect(result.score).toEqual(0);
    });

    it('returns score of 1', async () => {
      const result = await outcome(
        question,
        { answers: [{ id: '1' }] }
      );
      expect(result.score).toEqual(1);
    });

    describe('partial scoring', () => {
      beforeEach(() => {
        const shapes = question.shapes.concat({
          id: '4',
          correct: true
        });
        question = {
          ...question,
          partialScoring: true,
          shapes
        };
      });
      it('returns a score of 0.25', async () => {
        const result = await outcome(
          question,
          { answers: [{ id: '2' }] }
        );
        expect(result.score).toEqual(0.25);
      });

      it('returns a score of 0.5', async () => {
        const result = await outcome(
          question,
          { answers: [{ id: '2' }, { id: '4' }] }
        );
        expect(result.score).toEqual(0.5);
      });

      it('returns a score of 0.75', async () => {
        const result = await outcome(
          question,
          { answers: [{ id: '4' }] }
        );
        expect(result.score).toEqual(0.75);
      });

      it('returns a score of 1', async () => {
        const result = await outcome(
          question,
          { answers: [{ id: '1' }, { id: '4' }] }
        );
        expect(result.score).toEqual(1);
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

      it('returns dimensions', () => {
        expect(result.dimensions).toEqual({ height: 0, width: 0 });
      });

      it('returns outlineColor', () => {
        expect(result.outlineColor).toEqual('blue');
      });

      it('returns hotspotColor', () => {
        expect(result.hotspotColor).toEqual('lightblue');
      });

      it('returns multipleCorrect', () => {
        expect(result.multipleCorrect).toEqual(true);
      });

      it('returns shapes', () => {
        expect(result.shapes).toEqual(
          expect.arrayContaining([
            { id: '1', correct: true },
            { id: '2' },
            { id: '3' }
          ])
        );
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
        session = { answers: [] };
        env = { mode: 'evaluate' };
        isResponseCorrect.mockReturnValue(false);
        result = await model(question, session, env);
        return result;
      });

      it('returns choices w/ correct', () => {
        expect(result.shapes).toEqual(
          expect.arrayContaining([
            { id: '1', correct: true },
            { id: '2' },
            { id: '3' }
          ])
        );
      });

      it('returns is response correct', () => {
        expect(result.responseCorrect).toEqual(false);
      });
    });
  });
});
