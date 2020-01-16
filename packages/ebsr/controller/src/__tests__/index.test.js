import { model, outcome, createCorrectResponseSession } from '../index';
import { isResponseCorrect } from '../utils';

const PART_A = 'partA';
const PART_B = 'partB';

jest.mock('../utils', () => ({
  isResponseCorrect: jest.fn()
}));

xdescribe('controller', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      partA: {
        choiceMode: 'checkbox',
        feedbackEnabled: true,
        choices: [
          {
            value: 'yellow',
            label: 'Yellow',
            correct: true,
            feedback: {
              type: 'custom',
              value: 'foo'
            }
          },
          {
            value: 'green',
            label: 'Green',
            feedback: {
              type: 'default'
            }
          }
        ],
        choicePrefix: 'numbers',
        prompt: `prompt ${PART_A}`,
        promptEnabled: true,
        lockChoiceOrder: true,
        partialScoring: false
      },
      partB: {
        choiceMode: 'checkbox',
        feedbackEnabled: true,
        choices: [
          {
            value: 'orange',
            label: 'Orange',
            correct: true,
            feedback: {
              type: 'custom',
              value: 'foo'
            }
          },
          {
            value: 'purple',
            label: 'Purple',
            feedback: {
              type: 'default'
            }
          },
          {
            value: 'c',
            correct: true
          }
        ],
        choicePrefix: 'numbers',
        prompt: `prompt ${PART_B}`,
        promptEnabled: true,
        lockChoiceOrder: true,
        partialScoring: false
      }
    };
  });

  describe('outcome partialScoring test', () => {
    const mkQuestion = (partAExtra, partBExtra) => ({
      partA: {
        choiceMode: 'radio',
        feedbackEnabled: true,
        choices: [
          {
            value: 'yellow',
            label: 'Yellow',
            correct: true,
            feedback: {
              type: 'custom',
              value: 'foo'
            }
          },
          {
            value: 'blue',
            label: 'Blue',
            correct: true,
            feedback: {
              type: 'custom',
              value: 'foo'
            }
          },
          {
            value: 'green',
            label: 'Green',
            feedback: {
              type: 'default'
            }
          }
        ],
        choicePrefix: 'numbers',
        prompt: `prompt ${PART_A}`,
        promptEnabled: true,
        lockChoiceOrder: true,
        partialScoring: false,
        ...partAExtra
      },
      partB: {
        choiceMode: 'radio',
        feedbackEnabled: true,
        choices: [
          {
            value: 'orange',
            label: 'Orange',
            correct: true,
            feedback: {
              type: 'custom',
              value: 'foo'
            }
          },
          {
            value: 'red',
            label: 'Red',
            correct: true,
            feedback: {
              type: 'custom',
              value: 'foo'
            }
          },
          {
            value: 'purple',
            label: 'Purple',
            feedback: {
              type: 'default'
            }
          }
        ],
        choicePrefix: 'numbers',
        prompt: `prompt ${PART_B}`,
        promptEnabled: true,
        lockChoiceOrder: true,
        partialScoring: false,
        ...partBExtra
      }
    });

    const assertOutcome = (
      message,
      extraA,
      extraB,
      value1,
      value2,
      env,
      expected
    ) => {
      it(message, async () => {
        const question = mkQuestion(extraA, extraB);
        const result = await outcome(
          question,
          { value: { partA: { value: value1 }, partB: { value: value2 } } },
          env
        );
        expect(result.score).toEqual(expected);
      });
    };

    assertOutcome(
      'element.partA.partialScoring = true, element.partB.partialScoring = true',
      { partialScoring: true },
      { partialScoring: true },
      ['yellow'],
      ['orange'],
      { mode: 'evaluate' },
      1.34
    );

    assertOutcome(
      'element.partA.partialScoring = true, element.partB.partialScoring = false',
      { partialScoring: true },
      { partialScoring: false },
      ['yellow'],
      ['orange'],
      { mode: 'evaluate' },
      0.67
    );

    assertOutcome(
      'element.partA.partialScoring = false, element.partB.partialScoring = true',
      { partialScoring: false },
      { partialScoring: true },
      ['yellow'],
      ['orange'],
      { mode: 'evaluate' },
      0
    );

    assertOutcome(
      'element.partA.partialScoring = false, element.partB.partialScoring = false',
      {},
      {},
      ['yellow'],
      ['orange'],
      { mode: 'evaluate' },
      0
    );
  });

  describe('outcome', () => {
    describe('dichotomous', () => {
      const returnsScoreOf = (message, values1, values2, score) => {
        it(`${message} => ${score}`, async () => {
          const result = await outcome(
            { ...question, partialScoring: false },
            { value: { partA: { value: values1 }, partB: { value: values2 } } }
          );
          expect(result.score).toEqual(score);
          expect(result.max).toEqual(1);
        });
      };

      returnsScoreOf('both correct', ['yellow'], ['orange', 'c'], 1); // both correct
      returnsScoreOf('both incorrect', ['green'], ['purple'], 0); // both wrong
      returnsScoreOf(
        'partA incorrect, partB correct',
        ['green'],
        ['orange', 'c'],
        0
      ); // first wrong, second correct
      returnsScoreOf(
        'partA correct, partB incorrect',
        ['yellow'],
        ['purple'],
        0
      ); // first correct, second wrong
    });

    describe('partial scoring', () => {
      const returnsScoreOf = (message, values1, values2, score) => {
        it(`${message} => ${score}`, async () => {
          const result = await outcome(
            { ...question, partialScoring: true },
            { value: { partA: { value: values1 }, partB: { value: values2 } } }
          );
          expect(result.score).toBeCloseTo(score);
          expect(result.max).toEqual(2);
        });
      };

      returnsScoreOf('both correct', ['yellow'], ['orange', 'c'], 2);
      returnsScoreOf('both incorrect', [], [], 0);
      returnsScoreOf('partA correct, partB incorrect', ['yellow'], [], 1);
      returnsScoreOf(
        'partA correct, partB partially correct',
        ['yellow'],
        ['c'],
        1
      );
      returnsScoreOf(
        'partA incorrect, partB correct',
        ['green'],
        ['orange', 'c'],
        0
      );
      returnsScoreOf(
        'partA partially correct, partB correct',
        ['green', 'yellow'],
        ['orange', 'c'],
        0
      );
    });

    const returnsScoreWhen = session => {
      it(`returns empty: true if session is ${JSON.stringify(
        session
      )}`, async () => {
        const result = await outcome(question, session);
        expect(result).toEqual({ score: 0, scoreA: 0, scoreB: 0, empty: true });
      });
    };

    returnsScoreWhen(undefined);
    returnsScoreWhen(null);
    returnsScoreWhen({});
  });

  describe('model', () => {
    const capitalize = value => value.charAt(0).toUpperCase() + value.slice(1);

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

      const returnsPrompt = part => {
        it(`returns ${part} prompt`, () => {
          expect(result[part].prompt).toEqual(`prompt ${part}`);
        });
      };

      const returnsChoiceMode = part => {
        it(`returns ${part} choiceMode`, () => {
          expect(result[part].choiceMode).toEqual('checkbox');
        });
      };

      const returnsKeyMode = part => {
        it(`returns ${part} choicePrefix`, () => {
          expect(result[part].choicePrefix).toEqual('numbers');
        });
      };

      const returnsComplete = (part, min) => {
        it(`returns ${part} complete`, () => {
          expect(result[part].complete).toEqual({ min });
        });
      };

      const doesNotReturnCorrect = part => {
        it(`does not return ${part} responseCorrect`, () => {
          expect(result[part].responseCorrect).toBe(undefined);
        });
      };

      const returnsChoices = (part, value1, value2) => {
        it(`returns ${part} choices`, () => {
          expect(result[part].choices).toEqual(
            expect.arrayContaining([
              { value: value1, label: capitalize(value1), rationale: null },
              { value: value2, label: capitalize(value2), rationale: null }
            ])
          );
        });
      };

      returnsPrompt(PART_A);
      returnsPrompt(PART_B);

      returnsChoiceMode(PART_A);
      returnsChoiceMode(PART_B);

      returnsKeyMode(PART_A);
      returnsKeyMode(PART_B);

      returnsComplete(PART_A, 1);
      returnsComplete(PART_B, 2);

      returnsChoices(PART_A, 'yellow', 'green');
      returnsChoices(PART_B, 'orange', 'purple');

      doesNotReturnCorrect(PART_A);
      doesNotReturnCorrect(PART_B);
    });

    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        session = { id: '1', element: 'ebsr-element' };
        env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model(
          {
            ...question,
            partA: {
              ...question.partA,
              lockChoiceOrder: false
            },
            partB: {
              ...question.partB,
              lockChoiceOrder: false
            }
          },
          session,
          env,
          updateSession
        );
        expect(updateSession).toHaveBeenCalledWith('1', 'ebsr-element', {
          shuffledValues: {
            partA: expect.arrayContaining(['yellow', 'green']),
            partB: expect.arrayContaining(['orange', 'purple'])
          }
        });
      });
    });

    describe('model - without valid updateSession', () => {
      const assertModel = updateSession => {
        it(`does not throw error if updateSession is ${updateSession}`, async () => {
          session = {
            id: '1',
            element: 'ebsr-element',
            shuffledValues: { partA: [], partB: [] }
          };
          env = { mode: 'gather' };

          await model(
            {
              ...question,
              partA: {
                ...question.partA,
                lockChoiceOrder: false
              },
              partB: {
                ...question.partB,
                lockChoiceOrder: false
              }
            },
            session,
            env
          );
        });
      };

      assertModel(undefined);
      assertModel(null);
      assertModel('text');
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
        session = {};
        env = { mode: 'evaluate' };
        isResponseCorrect.mockReturnValue(false);
        result = await model(question, session, env);
        return result;
      });

      const returnsChoicesWCorrect = (part, value1, value2) => {
        it(`returns ${part} choices w/ correct`, () => {
          expect(result[part].choices).toEqual(
            expect.arrayContaining([
              {
                value: value1,
                label: capitalize(value1),
                correct: true,
                feedback: 'foo',
                rationale: null
              },
              {
                value: value2,
                label: capitalize(value2),
                correct: false,
                feedback: 'Incorrect',
                rationale: null
              }
            ])
          );
        });
      };

      const returnsChoicesWCorrectFeedbackDisabled = (part, value1, value2) => {
        // feedback enabled for partB and disabled for partA
        it(`returns ${part} choices w/ correct even if feedbackEnabled is false`, async () => {
          let res = await model(
            {
              ...question,
              partA: {
                ...question.partA,
                feedbackEnabled: false
              },
              partB: {
                ...question.partB,
                feedbackEnabled: false
              }
            },
            session,
            env
          );

          expect(result[part].choices).toEqual(
            expect.arrayContaining([
              {
                value: value1,
                label: capitalize(value1),
                correct: true,
                feedback: 'foo',
                rationale: null
              },
              {
                value: value2,
                label: capitalize(value2),
                correct: false,
                feedback: 'Incorrect',
                rationale: null
              }
            ])
          );
        });
      };

      const returnsIsResponseCorrect = part => {
        it(`returns ${part} is response correct`, () => {
          expect(result[part].responseCorrect).toEqual(false);
        });
      };

      // Second param will be correct (yellow for A; orange for B)
      returnsChoicesWCorrect(PART_A, 'yellow', 'green');
      returnsChoicesWCorrect(PART_B, 'orange', 'purple');

      // Second param will be correct (yellow for A; orange for B)
      returnsChoicesWCorrectFeedbackDisabled(PART_A, 'yellow', 'green');
      returnsChoicesWCorrectFeedbackDisabled(PART_B, 'orange', 'purple');

      returnsIsResponseCorrect(PART_A);
      returnsIsResponseCorrect(PART_B);
    });

    describe('correct response', () => {
      it('returns correct response if env is correct', async () => {
        const sess = await createCorrectResponseSession(question, {
          mode: 'gather',
          role: 'instructor'
        });
        expect(sess).toEqual({
          id: '1',
          value: {
            partA: { id: 'partA', value: ['yellow'] },
            partB: { id: 'partB', value: ['orange', 'c'] }
          }
        });
      });

      it('returns null env is student', async () => {
        const noResult = await createCorrectResponseSession(question, {
          mode: 'gather',
          role: 'student'
        });
        expect(noResult).toBeNull();
      });
    });
  });
});
