import { model, outcome } from '../index';

describe('controller', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      prompt: 'This is the question prompt',
      promptEnabled: true,
      imageUrl: '',
      imageDimensions: {
        height: 0,
        width: 0
      }
    };
  });

  describe('outcome', () => {
    it('returns score of 0', async () => {
      const result = await outcome(question);
      expect(result.score).toEqual(0);
    });
  });

  describe('model', () => {
    describe('mode: gather', () => {
      beforeEach(async () => {
        session = {};
        env = { mode: 'gather' };
        result = await model(question, session, env);
      });

      it('returns mode', () => {
        expect(result.mode).toEqual('gather');
      });

      it('returns prompt', () => {
        expect(result.prompt).toEqual('This is the question prompt');
      });

      it('returns imageDimensions', () => {
        expect(result.imageDimensions).toEqual({ height: 0, width: 0 });
      });

      it('does not return responseCorrect', () => {
        expect(result.responseCorrect).toBe(undefined);
      });
    });
  });
});
