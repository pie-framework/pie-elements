import { model, outcome, createCorrectResponseSession } from '../index';
import { isResponseCorrect } from '../utils';

describe('controller', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      prompt: 'prompt',
      promptEnabled: true,
      imageUrl: '',
      dimensions: {
        height: 0,
        width: 0
      },
      outlineColor: 'blue',
      hotspotColor: 'lightblue',
      shapes: {
        rectangles: [
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
        polygons: [
          {
            id: '4',
            correct: true
          }
        ]
      },
      multipleCorrect: true,
      partialScoring: false
    };
  });

  describe('outcome partialScoring test', () => {
    beforeEach(() => {
      const rectangles = question.shapes.rectangles.concat({
        id: '5',
        correct: true
      });
      question = {
        ...question,
        shapes: {
          ...question.shapes,
          rectangles
        }
      };
    });

    const assertOutcome = (message, extra, sessionValue, env, expected) => {
      it(message, async () => {
        const result = await outcome(
          {...question, ...extra},
          sessionValue,
          env
        );
        expect(result).toEqual(expect.objectContaining(expected));
      });
    };

    assertOutcome('element.partialScoring = true',
      { partialScoring: true }, { answers: [{ id: '2' }] }, { mode: 'evaluate' }, { score: 0.2 });

    assertOutcome('element.partialScoring = false',
      { partialScoring: false }, { answers: [{ id: '2' }] }, { mode: 'evaluate' }, { score: 0 });

    assertOutcome('element.partialScoring = false, env.partialScoring = true',
      { partialScoring: false }, { answers: [{ id: '2' }] }, { mode: 'evaluate', partialScoring: true }, { score: 0.2 });

    assertOutcome('element.partialScoring = true, env.partialScoring = false',
      { partialScoring: true }, { answers: [{ id: '2' }] }, { mode: 'evaluate', partialScoring: false }, { score: 0 });
  });

  describe('outcome', () => {
    it('returns score of 0', async () => {
      const result = await outcome(
        question,
        { answers: [{ id: '2' }] }
      );
      expect(result.score).toEqual(0);
    });

    it('returns score of 1 (partialScoring: false, answers in order)', async () => {
      const result = await outcome(
        question,
        { answers: [{ id: '1' }, { id: '4' }] }
      );
      expect(result.score).toEqual(1);
    });

    it('returns score of 1 (partialScoring: false, answers not in order)', async () => {
      const result = await outcome(
        question,
        { answers: [{ id: '4' }, { id: '1' }] }
      );
      expect(result.score).toEqual(1);
    });

    describe('partial scoring', () => {
      beforeEach(() => {
        const rectangles = question.shapes.rectangles.concat({
          id: '5',
          correct: true
        });
        question = {
          ...question,
          partialScoring: true,
          shapes: {
            ...question.shapes,
            rectangles
          }
        };
      });
      it('returns a score of 0.2', async () => {
        const result = await outcome(
          question,
          { answers: [{ id: '2' }] }
        );
        expect(result.score).toEqual(0.2);
      });

      it('returns a score of 0.4', async () => {
        const result = await outcome(
          question,
          { answers: [{ id: '2' }, { id: '5' }] }
        );
        expect(result.score).toEqual(0.4);
      });

      it('returns a score of 0.4, even if answers are not in order', async () => {
        const result = await outcome(
          question,
          { answers: [{ id: '5' }, { id: '2' }] }
        );
        expect(result.score).toEqual(0.4);
      });


      it('returns a score of 0.6', async () => {
        const result = await outcome(
          question,
          { answers: [{ id: '5' }] }
        );
        expect(result.score).toEqual(0.6);
      });

      it('returns a score of 1', async () => {
        const result = await outcome(
          question,
          { answers: [{ id: '1' }, { id: '4' }, { id: '5' }] }
        );
        expect(result.score).toEqual(1);
      });
    });

    const returnOutcome = session => {
      it(`returns empty: true when session is ${JSON.stringify(session)}`, async () => {
        const result = await outcome(question, session);
        expect(result).toEqual({ score: 0, empty: true });
      });
    };

    returnOutcome(undefined);
    returnOutcome(null);
    returnOutcome({});
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
        expect(result.shapes.rectangles).toEqual(
          expect.arrayContaining([
            { id: '1', correct: true },
            { id: '2' },
            { id: '3' }
          ])
        );
        expect(result.shapes.polygons).toEqual(
          expect.arrayContaining([
            { id: '4', correct: true }
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
        result = await model(question, session, env);
        return result;
      });

      it('returns choices w/ correct', () => {
        expect(result.shapes.rectangles).toEqual(
          expect.arrayContaining([
            { id: '1', correct: true },
            { id: '2' },
            { id: '3' }
          ])
        );
        expect(result.shapes.polygons).toEqual(
          expect.arrayContaining([
            { id: '4', correct: true }
          ])
        );
      });

      it('returns is response correct', () => {
        expect(result.responseCorrect).toEqual(false);
      });
    });
  });

  describe('isResponseCorrect', () => {
    const returnIsResponseCorect = session => {
      it(`response is not correct if session is ${JSON.stringify(session)}`, () => {
        expect(isResponseCorrect(question, session)).toEqual(false);
      });
    };

    returnIsResponseCorect(undefined);
    returnIsResponseCorect(null);
    returnIsResponseCorect({});
  });

  describe('correct response', () => {


    it('returns correct response if env is correct', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'instructor'
      });
      expect(sess).toEqual({"answers": [{"id": "1"}, {"id": "4"}], "id": "1"});
    });

    it('returns null env is student', async () => {
      const noResult = await createCorrectResponseSession(question, { mode: 'gather', role: 'student' });
      expect(noResult).toBeNull();
    });
  });

});
