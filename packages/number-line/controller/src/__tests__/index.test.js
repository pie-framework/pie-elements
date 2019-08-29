import _ from 'lodash';
import { defaults } from '@pie-lib/feedback';
import * as controller from '../index';

const mkQuestion = extras => ({
  correctResponse: [
    {
      type: 'point',
      pointType: 'full',
      position: 1
    },
    {
      type: 'ray',
      direction: 'left',
      position: 1,
      pointType: 'empty'
    }
  ],
  graph: {
    domain: { min: 0, max: 1 }
  },
  feedback: {
    correct: {
      type: 'default'
    },
    incorrect: {
      type: 'default'
    },
    partial: {
      type: 'default'
    }
  },
  ...extras
});

const correctSession = {
  answer: mkQuestion().correctResponse
};

const incorrectSession = {
  answer: [{ type: 'point', pointType: 'empty', position: 2 }]
};
const partiallyCorrect = {
  answer: [mkQuestion().correctResponse[0]]
};

const mode = m => ({ mode: m });

describe('controller', () => {
  describe('closeTo', () => {
    const assertCloseTo = (a, b, isClose, precision) => {
      precision = precision || 0.00001;
      it(`${a} <-> ${b}, ${precision} = ${isClose}`, () => {
        expect(controller.closeTo(a, b, precision)).toEqual(isClose);
      });
    };

    assertCloseTo(1, 1, true);
    assertCloseTo(1, 1.000000001, true);
    assertCloseTo(1, 1.0000000000000000000000000000001, true);
    assertCloseTo(1, 2, false);
    assertCloseTo(1.1, 1, true, 0);
    assertCloseTo(1.1, 1, false, 1);
    assertCloseTo(1.088, 1.083, false, 2);
    assertCloseTo(1.088, 1.084, true, 2);
    assertCloseTo(1.088, 1.087, true, 2);
    assertCloseTo(1.088, 1.092, true, 2);
    assertCloseTo(1.088, 1.093, true, 2);
    assertCloseTo(1.088, 1.094, false, 2);
    assertCloseTo(1.11, 1.14, true, 1);
    assertCloseTo(1.11, 1.08, true, 1);
    assertCloseTo(1.1, 1, false, 2);
    assertCloseTo(1, 1.1, true, 0.1);
    assertCloseTo(1, 1.1, true, 0.6);
    assertCloseTo(1, 1.1, true, 0.2);
    assertCloseTo(1, 1.1, false, 1);
  });

  describe('outcome', () => {
    const assertOutcome = (label, question, session, env, expected) => {
      it(label, async () => {
        const result = await controller.outcome(question, session, env);
        expect(result).toMatchObject(expected);
      });
    };

    describe('with many decimal places', () => {
      it('handles numbers close to each other', async () => {
        const q = {
          correctResponse: [
            {
              pointType: 'full',
              type: 'point',
              domainPosition: 0.41666664999999997
            }
          ]
        };
        const s = {
          answer: [
            {
              pointType: 'full',
              type: 'point',
              domainPosition: 0.4166666666666667
            }
          ]
        };
        const e = { mode: 'evaluate' };
        const result = await controller.outcome(q, s, e);
        expect(result).toEqual({ score: 1 });
      });
    });

    assertOutcome(
      'with deductions',
      mkQuestion(),
      {
        answer: [
          ...mkQuestion().correctResponse,
          { type: 'point', pointType: 'full', position: -3.3 }
        ]
      },
      {},
      { score: 0.5 }
    );

    assertOutcome('correct', mkQuestion(), correctSession, {}, { score: 1 });
    assertOutcome(
      'incorrect',
      mkQuestion(),
      incorrectSession,
      {},
      { score: 0 }
    );
    assertOutcome(
      'partial on by default',
      mkQuestion(),
      partiallyCorrect,
      {},
      { score: 0.5 }
    );
    assertOutcome(
      'partial disabled in env',
      mkQuestion(),
      partiallyCorrect,
      { partialScoring: false },
      { score: 0 }
    );
    assertOutcome(
      'partial disabled in model',
      mkQuestion({ partialScoring: false }),
      partiallyCorrect,
      {},
      { score: 0.0 }
    );
    assertOutcome(
      'partial enabled in model',
      mkQuestion({ partialScoring: true }),
      partiallyCorrect,
      {},
      { score: 0.5 }
    );

    assertOutcome(
      'returns score: 0 and empty: true if session is undefined',
      mkQuestion({ partialScoring: true }),
      undefined,
      { mode: 'evaluate' },
      { score: 0, empty: true }
    );

    assertOutcome(
      'returns score: 0 and empty: true if session is null',
      mkQuestion({ partialScoring: false }),
      null,
      { mode: 'evaluate' },
      { score: 0, empty: true }
    );

    assertOutcome(
      'returns score: 0 and empty: true if session is {}',
      mkQuestion({ partialScoring: true }),
      {},
      { mode: 'evaluate' },
      { score: 0, empty: true }
    );
  });

  describe('model', () => {
    const assertModel = (msg, question, session, env, expected) => {
      question = mkQuestion(question);
      session = _.merge(session, {});
      env = _.merge(env, {});

      it(msg, () => {
        return controller
          .model(question, session, env)
          .then(o => {
            if (_.isFunction(expected)) {
              expected(o);
            } else {
              expect(o).toMatchObject(expected);
            }
          })
          .catch(e => {
            throw new Error('Create Model spec error');
          });
      });
    };

    assertModel(
      'empty',
      {},
      {},
      {},
      {
        graph: {},
        disabled: true,
        colorContrast: 'black_on_white'
      }
    );

    describe('disabled', () => {
      assertModel(
        'disabled is missing in gather mode',
        {},
        {},
        { mode: 'gather' },
        r => {
          expect(r.disabled).toBe(undefined);
        }
      );

      assertModel(
        'disabled is true if exhibitOnly is true',
        {
          graph: {
            exhibitOnly: true
          }
        },
        {},
        { mode: 'gather' },
        r => {
          expect(r.disabled).toBe(true);
        }
      );
    });

    describe('graph', () => {
      assertModel(
        'graph is returned',
        { graph: { domain: { min: -1, max: 1 } } },
        {},
        {},
        {
          graph: {
            domain: { min: -1, max: 1 }
          }
        }
      );
    });

    describe('corrected', () => {
      assertModel(
        'corrected.correct has answer index 0',
        {},
        correctSession,
        { mode: 'evaluate' },
        {
          corrected: {
            correct: [0, 1],
            incorrect: [],
            notInAnswer: []
          }
        }
      );

      assertModel(
        'corrected.incorrect has answer index 0',
        {},
        incorrectSession,
        { mode: 'evaluate' },
        {
          corrected: {
            correct: [],
            incorrect: [0]
          }
        }
      );
    });

    describe('correctResponse', () => {
      assertModel(
        'correctResponse is empty if correct',
        {},
        correctSession,
        mode('evaluate'),
        o => expect(o.correctResponse).toBe(undefined)
      );

      assertModel(
        'correctResponse is not empty if correct',
        {},
        incorrectSession,
        mode('evaluate'),
        { correctResponse: mkQuestion().correctResponse }
      );
    });

    describe('feedback', () => {
      const assertFeedback = (s, fbType) => {
        assertModel(fbType, {}, s, mode('evaluate'), {
          feedback: {
            type: fbType,
            message: defaults[fbType].default
          }
        });
      };
      assertFeedback(correctSession, 'correct');
      assertFeedback(incorrectSession, 'incorrect');
      assertFeedback({ answer: [] }, 'unanswered');
    });

    describe('color contrast', () => {
      const assertDefault = c => {
        assertModel(
          `returns ${c}`,
          mkQuestion,
          {},
          { accessibility: { colorContrast: c } },
          {
            colorContrast: c
          }
        );
      };
      assertDefault('black_on_white');
      assertDefault('white_on_black');
      assertDefault('black_on_rose');
    });

    describe('session not set', () => {
      const assertModel = sess => {
        it(`returns feedback unknown if session is ${JSON.stringify(sess)}`, async () => {
          const m = await controller.model(mkQuestion(), sess, { mode: 'evaluate' });
          expect(m).toMatchObject({
            feedback: { type: 'unanswered', message: defaults.unanswered.default }});
        });
      };

      assertModel(undefined);
      assertModel(null);
      assertModel({});
    });
  });
});
