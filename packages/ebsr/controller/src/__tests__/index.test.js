import { model, outcome } from '../index';
import { isResponseCorrect } from '../utils';

const PART_A = 'partA';
const PART_B = 'partB';

jest.mock('../utils', () => ({
  isResponseCorrect: jest.fn()
}));

describe('controller', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      partA: {
        choiceMode: 'radio',
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
          },
        ],
        choicePrefix: 'numbers',
        prompt: `prompt ${PART_A}`,
      },
      partB: {
        choiceMode: 'radio',
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
        ],
        choicePrefix: 'numbers',
        prompt: `prompt ${PART_B}`,
      }
    };
  });

  describe('outcome', () => {
    const returnsScoreOf = (value1, value2, score) => {
      it(`returns score of ${score}`, async () => {
        const result = await outcome(
          question,
          { value: { partA: { value: [value1] }, partB: { value: [value2] } } },
          { mode: 'gather' }
        );
        expect(result.score).toEqual(score);
      });
    };

    returnsScoreOf('green', 'purple', 0); // both wrong
    returnsScoreOf('green', 'orange', 0); // first wrong, second correct
    returnsScoreOf('yellow', 'purple', 1); // first correct, second wrong
    returnsScoreOf('yellow', 'orange', 2); // both correct

    describe('partial scoring', () => {
      beforeEach(() => {
        const turnPartialCorrectOn = (part) => {
          const choices = question[part].choices.concat({ value: 'c', correct: true });
          question[part] = {
            ...question[part],
            partialScoring: true,
            choices
          };
        };

        turnPartialCorrectOn(PART_B);
      });

      const returnsScoreOf = (value1, value2, score) => {
        it(`returns a score of ${score}`, async () => {
          const result = await outcome(question, { value: { partA: value1, partB: value2 } }, {});
          expect(result.score).toBeCloseTo(score);
        });
      };

      returnsScoreOf({}, {}, 0);
      returnsScoreOf({ value: ['yellow'] }, {}, 1.33);
      returnsScoreOf({ value: ['yellow'] }, { value: ['orange'] }, 1.67);
      returnsScoreOf({ value: ['yellow'] }, { value: ['orange', 'c'] }, 2);
    });
  });

  describe('model', () => {
    const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

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

      const returnsPrompt = (part) => {
        it(`returns ${part} prompt`, () => {
          expect(result[part].prompt).toEqual(`prompt ${part}`);
        });
      };

      const returnsChoiceMode = (part) => {
        it(`returns ${part} choiceMode`, () => {
          expect(result[part].choiceMode).toEqual('radio');
        });
      };

      const returnsKeyMode = (part) => {
        it(`returns ${part} choicePrefix`, () => {
          expect(result[part].choicePrefix).toEqual('numbers');
        });
      };

      const returnsComplete = (part) => {
        it(`returns ${part} complete`, () => {
          expect(result[part].complete).toEqual({ min: 1 });
        });
      };

      const doesNotReturnCorrect = (part) => {
        it(`does not return ${part} responseCorrect`, () => {
          expect(result[part].responseCorrect).toBe(undefined);
        });
      };

      const returnsChoices = (part, value1, value2) => {
        it(`returns ${part} choices`, () => {
          expect(result[part].choices).toEqual(
            expect.arrayContaining([
              { value: value1, label: capitalize(value1) },
              { value: value2, label: capitalize(value2) }
            ]));
        });
      };

      returnsPrompt(PART_A);
      returnsPrompt(PART_B);

      returnsChoiceMode(PART_A);
      returnsChoiceMode(PART_B);

      returnsKeyMode(PART_A);
      returnsKeyMode(PART_B);

      returnsComplete(PART_A);
      returnsComplete(PART_B);

      returnsChoices(PART_A, 'yellow', 'green');
      returnsChoices(PART_B, 'orange', 'purple');

      doesNotReturnCorrect(PART_A);
      doesNotReturnCorrect(PART_B);
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
              { value: value1, label: capitalize(value1), correct: true, feedback: 'foo' },
              { value: value2, label: capitalize(value2), correct: false, feedback: 'Incorrect' }
            ]));
        });
      };

      const returnsIsResponseCorrect = (part) => {
        it(`returns ${part} is response correct`, () => {
          expect(result[part].responseCorrect).toEqual(false);
        });
      };

      // Second param will be correct (yellow for A; orange for B)
      returnsChoicesWCorrect(PART_A, 'yellow', 'green');
      returnsChoicesWCorrect(PART_B, 'orange', 'purple');

      returnsIsResponseCorrect(PART_A);
      returnsIsResponseCorrect(PART_B);
    });
  });
});
