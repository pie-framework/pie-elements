import { model, outcome, getPartialScore, isResponseCorrect } from '../index';

jest.mock('../utils', () => ({
  ...(jest.requireActual('../utils.js')),
  isResponseCorrect: jest.fn().mockReturnValue(false)
}));

const rhomb = 'rhomb';
const hexagon = 'hexagon';
const square = 'square';
const trapeze = 'trapeze';

const responseContainer1 = {
  x: 0,
  y: 0,
  height: '0%',
  width: '0%'
};
const responseContainer2 = {
  x: 1,
  y: 1,
  height: '1%',
  width: '1%'
};

describe('controller', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      prompt: 'prompt',
      image: {
        src: '',
        width: 0,
        scale: false,
        height: 0
      },
      validation: {
        valid_response: {
          score: 1,
          value: [
            [rhomb, square],
            [rhomb, square, trapeze]
          ]
        }
      },
      possible_responses: [rhomb, hexagon, square, trapeze],
      response_containers: [responseContainer1, responseContainer2],
      duplicate_responses: true,
      max_response_per_zone: 5,
      partial_scoring: false
    };
  });

  describe('outcome', () => {
    const returnOutcome = session => {
      it(`returns score of 0 and empty: true if session is ${JSON.stringify(session)}`, async () => {
        const result = await outcome(question, session);
        expect(result).toEqual({ score: 0, empty: true });
      });
    };

    returnOutcome(undefined);
    returnOutcome(null);
    returnOutcome({});

    it('returns score of 0', async () => {
      const result = await outcome(
        question,
        { answers: [{ value: rhomb, containerIndex: 0 }] }
      );
      expect(result.score).toEqual(0);
    });

    it('returns score of 1', async () => {
      const result = await outcome(
        question,
        { answers: [
            { value: rhomb, containerIndex: 0 },
            { value: square, containerIndex: 0 },
            { value: rhomb, containerIndex: 1 },
            { value: square, containerIndex: 1 },
            { value: trapeze, containerIndex: 1 }
          ]
        }
      );
      expect(result.score).toEqual(1);
    });

    describe('alternate correct answers', () => {
      describe('handles one option', async () => {
        it('returns score of 1', async () => {
          const result = await outcome(
            {
              ...question,
              validation: {
                ...question.validation,
                alt_responses: [{
                  score: 1,
                  value: [
                    [rhomb],
                    [square],
                    [trapeze],
                    [hexagon]
                  ]
                }]
              }
            },
            { answers: [
                { value: rhomb, containerIndex: 0 },
                { value: square, containerIndex: 1 },
                { value: trapeze, containerIndex: 2 },
                { value: hexagon, containerIndex: 3 }
              ]
            }
          );
          expect(result.score).toEqual(1);
        });

        it('returns score of 0', async () => {
          const result = await outcome(
            {
              ...question,
              validation: {
                ...question.validation,
                alt_responses: [{
                  score: 1,
                  value: [
                    [rhomb],
                    [square],
                    [trapeze],
                    [hexagon]
                  ]
                }]
              }
            },
            { answers: [
                { value: rhomb, containerIndex: 3 },
                { value: square, containerIndex: 1 },
                { value: trapeze, containerIndex: 2 },
                { value: hexagon, containerIndex: 0 }
              ]
            }
          );
          expect(result.score).toEqual(0);
        });
      });

      describe('handles multiple options', async () => {
        it('returns score of 1', async () => {
          const result = await outcome(
            {
              ...question,
              validation: {
                ...question.validation,
                alt_responses: [{
                  score: 1,
                  value: [
                    [square],
                    [rhomb],
                    [hexagon],
                    [trapeze]
                  ]
                }, {
                  score: 1,
                  value: [
                    [rhomb],
                    [square],
                    [trapeze],
                    [hexagon]
                  ]
                }]
              }
            },
            { answers: [
                { value: rhomb, containerIndex: 0 },
                { value: square, containerIndex: 1 },
                { value: trapeze, containerIndex: 2 },
                { value: hexagon, containerIndex: 3 }
              ]
            }
          );
          expect(result.score).toEqual(1);
        });

        it('returns score of 0', async () => {
          const result = await outcome(
            {
              ...question,
              validation: {
                ...question.validation,
                alt_responses: [{
                  score: 1,
                  value: [
                    [square],
                    [rhomb],
                    [hexagon],
                    [trapeze]
                  ]
                }, {
                  score: 1,
                  value: [
                    [rhomb],
                    [square],
                    [trapeze],
                    [hexagon]
                  ]
                }]
              }
            },
            { answers: [
                { value: rhomb, containerIndex: 3 },
                { value: square, containerIndex: 1 },
                { value: trapeze, containerIndex: 2 },
                { value: hexagon, containerIndex: 0 }
              ]
            }
          );
          expect(result.score).toEqual(0);
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

      it('returns image', () => {
        expect(result.image).toEqual({
          src: '',
          width: 0,
          scale: false,
          height: 0
        });
      });

      it('returns validation', () => {
        expect(result.validation).toEqual({
          validResponse: {
            score: 1,
            value: [
              [rhomb, square],
              [rhomb, square, trapeze]
            ]
          }
        });
      });

      it('returns responseContainers', () => {
        expect(result.responseContainers).toEqual([
          responseContainer1,
          responseContainer2
        ]);
      });

      it('returns duplicateResponses', () => {
        expect(result.duplicateResponses).toEqual(true);
      });

      it('returns maxResponsePerZone', () => {
        expect(result.maxResponsePerZone).toEqual(5);
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

      it('returns is response correct', () => {
        expect(result.responseCorrect).toEqual(false);
      });

      const returnModel = sess => {
        it(`returns responseCorrect: false if session is ${JSON.stringify(sess)}`, async () => {
          const result = await model(question, sess, env = { mode: 'evaluate' });
          expect(result).toEqual(expect.objectContaining({
            responseCorrect: false
          }));
        });
      };

      returnModel(undefined);
      returnModel(null);
      returnModel({});
    });
  });

  describe('getPartialScore', () => {
    const returnPartialScore = sess => {
      it(`returns score of 0 if session is ${JSON.stringify(sess)}`, () => {
        const result = getPartialScore(question, sess);
        expect(result).toEqual(0);
      });
    };

    returnPartialScore(undefined);
    returnPartialScore(null);
    returnPartialScore({});
  });

  describe('isResponseCorrect', () => {
    const returnIsResponseCorrect = sess => {
      it(`returns score of 0 if session is ${JSON.stringify(sess)}`, () => {
        const result = isResponseCorrect([], sess);
        expect(result).toEqual(false);
      });
    };

    returnIsResponseCorrect(undefined);
    returnIsResponseCorrect(null);
    returnIsResponseCorrect({});
  });
});
