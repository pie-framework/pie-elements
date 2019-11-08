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
      },
      rationale: 'Rationale',
      teacherInstructions: 'Teacher Instructions'
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

      it('gather mode promptEnabled: true', async () => {
        result = await model(question, {}, { mode: 'gather'});

        expect(result).toEqual({
          disabled: false,
          mode: 'gather',
          imageUrl: question.imageUrl,
          imageDimensions: question.imageDimensions,
          prompt: question.prompt,
          rationale: null,
          teacherInstructions: null
        });
      });

      it('gather mode promptEnabled: false', async () => {
        result = await model({ ...question, promptEnabled: false }, {}, { mode: 'gather'});

        expect(result).toEqual({
          disabled: false,
          mode: 'gather',
          imageUrl: question.imageUrl,
          imageDimensions: question.imageDimensions,
          prompt: null,
          rationale: null,
          teacherInstructions: null
        });
      });


      it('view mode, student role', async () => {
        result = await model(question, {}, { mode: 'view'});

        expect(result).toEqual({
          disabled: true,
          mode: 'view',
          imageUrl: question.imageUrl,
          imageDimensions: question.imageDimensions,
          prompt: question.prompt,
          rationale: null,
          teacherInstructions: null
        });
      });

      it('view mode, instructor role, rationale and teacherInstructions enabled', async () => {
        result = await model(question, {}, { mode: 'view', role: 'instructor'});

        expect(result).toEqual({
          disabled: true,
          mode: 'view',
          imageUrl: question.imageUrl,
          imageDimensions: question.imageDimensions,
          prompt: question.prompt,
          rationale: question.rationale,
          teacherInstructions: question.teacherInstructions
        });
      });

      it('evaluate mode, instructor role, rationale and teacherInstructions disabled', async () => {
        result = await model(
          { ...question, rationaleEnabled: false, teacherInstructionsEnabled: false },
          {},
          { mode: 'evaluate', role: 'instructor'});

        expect(result).toEqual({
          disabled: true,
          mode: 'evaluate',
          imageUrl: question.imageUrl,
          imageDimensions: question.imageDimensions,
          prompt: question.prompt,
          rationale: null,
          teacherInstructions: null
        });
      });

      it('evaluate mode, student role', async () => {
        result = await model(question, {}, { mode: 'evaluate'});

        expect(result).toEqual({
          disabled: true,
          mode: 'evaluate',
          imageUrl: question.imageUrl,
          imageDimensions: question.imageDimensions,
          prompt: question.prompt,
          rationale: null,
          teacherInstructions: null
        });
      });

      it('evaluate mode, instructor role, rationale and teacherInstructions enabled', async () => {
        result = await model(question, {}, { mode: 'evaluate', role: 'instructor'});

        expect(result).toEqual({
          disabled: true,
          mode: 'evaluate',
          imageUrl: question.imageUrl,
          imageDimensions: question.imageDimensions,
          prompt: question.prompt,
          rationale: question.rationale,
          teacherInstructions: question.teacherInstructions
        });
      });

      it('view mode, instructor role, rationale and teacherInstructions disabled', async () => {
        result = await model(
          { ...question, rationaleEnabled: false, teacherInstructionsEnabled: false },
          {},
          { mode: 'view', role: 'instructor'});

        expect(result).toEqual({
          disabled: true,
          mode: 'view',
          imageUrl: question.imageUrl,
          imageDimensions: question.imageDimensions,
          prompt: question.prompt,
          rationale: null,
          teacherInstructions: null
        });
      });
    });
  });
});
