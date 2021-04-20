import {
  model,
  outcome,
  getPartialScore,
  isResponseCorrect,
  createCorrectResponseSession,
} from '../index';

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils.js'),
  isResponseCorrect: jest.fn().mockReturnValue(false),
}));

const rhomb = 'rhomb';
const hexagon = 'hexagon';
const square = 'square';
const trapeze = 'trapeze';

const responseContainer1 = {
  x: 0,
  y: 0,
  height: '0%',
  width: '0%',
};
const responseContainer2 = {
  x: 1,
  y: 1,
  height: '1%',
  width: '1%',
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
        height: 0,
      },
      validation: {
        valid_response: {
          score: 1,
          value: [
            {
              images: [rhomb, square]
            },
            {
              images: [rhomb, square, trapeze]
            },
          ],
        },
      },
      possible_responses: [rhomb, hexagon, square, trapeze],
      response_containers: [responseContainer1, responseContainer2],
      duplicate_responses: true,
      max_response_per_zone: 5,
      partialScoring: false,
    };
  });

  describe('outcome partialScoring test', () => {
    const assertOutcome = (message, extra, sessionValue, env, expected) => {
      it(message, async () => {
        const result = await outcome(
          { ...question, ...extra },
          sessionValue,
          env
        );

        expect(result).toEqual(expect.objectContaining(expected));
      });
    };

    assertOutcome(
      'element.partialScoring = true',
      { partialScoring: true },
      {
        answers: [
          { value: rhomb, containerIndex: 0 },
          { value: square, containerIndex: 0 },
          { value: rhomb, containerIndex: 1 },
          { value: square, containerIndex: 1 },
          { value: trapeze, containerIndex: 0 },
        ],
      },
      { mode: 'evaluate' },
      { score: 0.2 }
    );

    assertOutcome(
      'element.partialScoring = false',
      { partialScoring: false },
      {
        answers: [
          { value: rhomb, containerIndex: 0 },
          { value: square, containerIndex: 0 },
          { value: rhomb, containerIndex: 1 },
          { value: square, containerIndex: 1 },
          { value: trapeze, containerIndex: 0 },
        ],
      },
      { mode: 'evaluate' },
      { score: 0 }
    );

    assertOutcome(
      'element.partialScoring = false, env.partialScoring = true',
      { partialScoring: false },
      {
        answers: [
          { value: rhomb, containerIndex: 0 },
          { value: square, containerIndex: 0 },
          { value: rhomb, containerIndex: 1 },
          { value: square, containerIndex: 1 },
          { value: trapeze, containerIndex: 0 },
        ],
      },
      { mode: 'evaluate', partialScoring: true },
      { score: 0 }
    );

    assertOutcome(
      'element.partialScoring = true, env.partialScoring = false',
      { partialScoring: true },
      {
        answers: [
          { value: rhomb, containerIndex: 0 },
          { value: square, containerIndex: 0 },
          { value: rhomb, containerIndex: 1 },
          { value: square, containerIndex: 1 },
          { value: trapeze, containerIndex: 0 },
        ],
      },
      { mode: 'evaluate', partialScoring: false },
      { score: 0 }
    );
  });

  describe('outcome', () => {
    const returnOutcome = (session) => {
      it(`returns score of 0 and empty: true if session is ${JSON.stringify(
        session
      )}`, async () => {
        const result = await outcome(question, session);
        expect(result).toEqual({ score: 0, empty: true });
      });
    };

    returnOutcome(undefined);
    returnOutcome(null);
    returnOutcome({});

    it('returns score of 0', async () => {
      const result = await outcome(question, {
        answers: [{ value: rhomb, containerIndex: 0 }],
      });
      expect(result.score).toEqual(0);
    });

    it('returns score of 1', async () => {
      const result = await outcome(question, {
        answers: [
          { value: rhomb, containerIndex: 0 },
          { value: square, containerIndex: 0 },
          { value: rhomb, containerIndex: 1 },
          { value: square, containerIndex: 1 },
          { value: trapeze, containerIndex: 1 },
        ],
      });
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
                alt_responses: [
                  {
                    score: 1,
                    value: [{images: [rhomb]}, {images: [square]}, {images: [trapeze]}, {images: [hexagon]}],
                  },
                ],
              },
            },
            {
              answers: [
                { value: rhomb, containerIndex: 0 },
                { value: square, containerIndex: 1 },
                { value: trapeze, containerIndex: 2 },
                { value: hexagon, containerIndex: 3 },
              ],
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
                alt_responses: [
                  {
                    score: 1,
                    value: [{images: [rhomb]}, {images: [square]}, {images: [trapeze]}, {images: [hexagon]}],
                  },
                ],
              },
            },
            {
              answers: [
                { value: rhomb, containerIndex: 3 },
                { value: square, containerIndex: 1 },
                { value: trapeze, containerIndex: 2 },
                { value: hexagon, containerIndex: 0 },
              ],
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
                alt_responses: [
                  {
                    score: 1,
                    value: [{images: [square]}, {images: [rhomb]}, {images: [trapeze]}, {images: [hexagon]}],
                  },
                  {
                    score: 1,
                    value: [{images: [rhomb]}, {images: [square]}, {images: [trapeze]}, {images: [hexagon]}],
                  },
                ],
              },
            },
            {
              answers: [
                { value: rhomb, containerIndex: 0 },
                { value: square, containerIndex: 1 },
                { value: trapeze, containerIndex: 2 },
                { value: hexagon, containerIndex: 3 },
              ],
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
                alt_responses: [
                  {
                    score: 1,
                    value: [{images: [square]}, {images: [rhomb]}, {images: [trapeze]}, {images: [hexagon]}],
                  },
                  {
                    score: 1,
                    value: [{images: [rhomb]}, {images: [square]}, {images: [trapeze]}, {images: [hexagon]}],
                  },
                ],
              },
            },
            {
              answers: [
                { value: rhomb, containerIndex: 3 },
                { value: square, containerIndex: 1 },
                { value: trapeze, containerIndex: 2 },
                { value: hexagon, containerIndex: 0 },
              ],
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
          height: 0,
        });
      });

      it('returns validation', () => {
        expect(result.validation).toEqual({
          validResponse: {
            score: 1,
            value: [
              {images: [rhomb, square]},
              {images: [rhomb, square, trapeze]},
            ],
          },
        });
      });

      it('returns responseContainers', () => {
        expect(result.responseContainers).toEqual([
          responseContainer1,
          responseContainer2,
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

      const returnModel = (sess) => {
        it(`returns responseCorrect: false if session is ${JSON.stringify(
          sess
        )}`, async () => {
          const result = await model(
            question,
            sess,
            (env = { mode: 'evaluate' })
          );
          expect(result).toEqual(
            expect.objectContaining({
              responseCorrect: false,
            })
          );
        });
      };

      returnModel(undefined);
      returnModel(null);
      returnModel({});
    });
  });

  describe('getPartialScore', () => {
    const returnPartialScore = (sess) => {
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
    const returnIsResponseCorrect = (sess) => {
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

describe('createCorrectResponseSession', () => {
  const question = {
    prompt: 'This is the question prompt',
    image: {
      src: 'https://app.fluence.net/ia/image/6412223997a34018b15f8512bee6c04c',
      width: 465,
      scale: false,
      height: 313,
    },
    response_containers: [
      {
        pointer: undefined,
        wordwrap: true,
        x: 64.3,
        width: '35.70%',
        y: 1.6,
        height: '23.64%',
        aria_label: '',
      },
      {
        pointer: 'undefined',
        wordwrap: true,
        x: 64.09,
        width: '35.92%',
        y: 39.62,
        height: '23.32%',
        aria_label: '',
      },
    ],
    possible_responses: [
      '<img alt="" src="https://app.fluence.net/ia/image/9e5ed1d6762c4dac87b080e190af113d"/>',
      '<img alt="" src="https://app.fluence.net/ia/image/729ca157d04c440ab7ae1c2abfb9c057"/>',
    ],
    validation: {
      scoring_type: 'exactMatch',
      valid_response: {
        score: 1,
        value: [
          [
            '<img alt="" src="https://app.fluence.net/ia/image/729ca157d04c440ab7ae1c2abfb9c057"/>',
          ],
          [
            '<img alt="" src="https://app.fluence.net/ia/image/9e5ed1d6762c4dac87b080e190af113d"/>',
          ],
        ],
      },
    },
  };

  it('returns correct response if role is instructor and mode is gather', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'instructor',
    });

    expect(sess).toEqual({
      answers: [
        {
          value:
            '<img alt="" src="https://app.fluence.net/ia/image/729ca157d04c440ab7ae1c2abfb9c057"/>',
          containerIndex: 0,
        },
        {
          value:
            '<img alt="" src="https://app.fluence.net/ia/image/9e5ed1d6762c4dac87b080e190af113d"/>',
          containerIndex: 1,
        },
      ],
      id: '1',
    });
  });

  it('returns correct response if role is instructor and mode is view', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'view',
      role: 'instructor',
    });

    expect(sess).toEqual({
      answers: [
        {
          value:
            '<img alt="" src="https://app.fluence.net/ia/image/729ca157d04c440ab7ae1c2abfb9c057"/>',
          containerIndex: 0,
        },
        {
          value:
            '<img alt="" src="https://app.fluence.net/ia/image/9e5ed1d6762c4dac87b080e190af113d"/>',
          containerIndex: 1,
        },
      ],
      id: '1',
    });
  });

  it('returns null if mode is evaluate', async () => {
    const noResult = await createCorrectResponseSession(question, {
      mode: 'evaluate',
      role: 'instructor',
    });

    expect(noResult).toBeNull();
  });

  it('returns null if role is student', async () => {
    const noResult = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'student',
    });

    expect(noResult).toBeNull();
  });
});
