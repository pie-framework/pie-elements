import { model, outcome, getScore, createCorrectResponseSession, normalize } from '../index';
import { isResponseCorrect } from '../utils';
import defaults from '../defaults';

jest.mock('../utils', () => ({
  isResponseCorrect: jest.fn()
}));

describe('controller', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      id: '1',
      element: 'multiple-choice',
      prompt: 'prompt',
      promptEnabled: true,
      choicePrefix: 'letters',
      choiceMode: 'radio',
      feedbackEnabled: true,
      choices: [
        {
          label: 'a',
          value: 'apple',
          correct: true,
          feedback: {
            type: 'custom',
            value: 'foo'
          }
        },
        {
          label: 'b',
          value: 'banana',
          feedback: {
            type: 'default'
          }
        }
      ]
    };
  });

  const { stringify } = JSON;

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

      it('returns choiceMode', () => {
        expect(result.choiceMode).toEqual('radio');
      });

      it('returns choicePrefix', () => {
        expect(result.keyMode).toEqual('letters');
      });

      it('returns choices', () => {
        expect(result.choices).toEqual(
          expect.arrayContaining([
            { label: 'a', value: 'apple', rationale: null },
            { label: 'b', value: 'banana', rationale: null }
          ])
        );
      });

      it('does not return responseCorrect', () => {
        expect(result.responseCorrect).toBe(undefined);
      });
    });

    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        session = { id: '1', element: 'multiple-choice' };
        env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model(question, session, env, updateSession);
        expect(updateSession).toHaveBeenCalledWith('1', 'multiple-choice', {
          shuffledValues: expect.arrayContaining(['apple', 'banana'])
        });
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
        session = {};
        env = { mode: 'evaluate' };
        isResponseCorrect.mockReturnValue(false);
        result = await model(question, session, env);
        return result;
      });

      it('returns choices w/ correct', () => {
        expect(result.choices).toEqual(
          expect.arrayContaining([
            {
              label: 'a',
              value: 'apple',
              correct: true,
              feedback: 'foo',
              rationale: null
            },
            {
              label: 'b',
              value: 'banana',
              correct: false,
              feedback: 'Incorrect',
              rationale: null
            }
          ])
        );
      });

      it('returns choices w/ correct even if feedbackEnabled is false', async () => {
        result = await model({
          ...question,
          feedbackEnabled: false
        }, session, env, jest.fn());

        expect(result.choices).toEqual(
          expect.arrayContaining([
            {
              label: 'a',
              value: 'apple',
              correct: true,
              feedback: undefined,
              rationale: null
            },
            {
              label: 'b',
              value: 'banana',
              correct: false,
              feedback: undefined,
              rationale: null
            }
          ])
        );
      });

      it('returns feedback undefined if feedbackEnabled is false', async () => {
        result = await model({
          ...question,
          feedbackEnabled: false
        }, session, env, jest.fn());

        expect(result.choices).toEqual(
          expect.arrayContaining([
            {
              label: 'a',
              value: 'apple',
              correct: true,
              feedback: undefined,
              rationale: null
            },
            {
              label: 'b',
              value: 'banana',
              correct: false,
              feedback: undefined,
              rationale: null
            }
          ])
        );
      });

        it('returns proper feedback if feedbackEnabled is true', async () => {
        result = await model({
          ...question,
          feedbackEnabled: true
        }, session, env, jest.fn());

        expect(result.choices).toEqual(
          expect.arrayContaining([
            {
              label: 'a',
              value: 'apple',
              correct: true,
              feedback: 'foo',
              rationale: null
            },
            {
              label: 'b',
              value: 'banana',
              correct: false,
              feedback: 'Incorrect',
              rationale: null
            }
          ])
        );
      });

      it('returns is response correct', () => {
        expect(result.responseCorrect).toEqual(false);
      });

      const returnsCorrectness = sess => {
        it(`returns responseCorrect: false if session is ${stringify(sess)}`, async () => {
          const o = await model(question, sess, env);

          expect(o.responseCorrect).toEqual(false);
        });
      };

      returnsCorrectness(undefined);
      returnsCorrectness(null);
      returnsCorrectness({});
    });

    describe('choicePrefix is undefined', () => {
      const question = {
        id: '1',
        element: 'multiple-choice',
        prompt: 'prompt',
        promptEnabled: true,
        choiceMode: 'radio',
        feedbackEnabled: true,
        choices: [
          {
            label: 'a',
            value: 'apple',
            correct: true,
            feedback: {
              type: 'custom',
              value: 'foo'
            }
          },
          {
            label: 'b',
            value: 'banana',
            feedback: {
              type: 'default'
            }
          }
        ]
      };

      beforeEach(async () => {
        session = {};
        env = { mode: 'gather' };
        result = await model(question, session, env);
      });
      it('returns default letters', () => {
        expect(result.keyMode).toEqual('letters');
      });
    });
  });

  describe('getScore', () => {
    it.each`
        sessionValue                           |     expectedDychotomous     |     expectedPartialScoring
        ${undefined}                           |     ${0}                    |     ${0}
        ${null}                                |     ${0}                    |     ${0}
        ${[]}                                  |     ${0}                    |     ${0}
        ${['a']}                               |     ${0}                    |     ${0.5}
        ${['e']}                               |     ${0}                    |     ${0.5}
        ${['a', 'b']}                          |     ${0}                    |     ${0.5}
        ${['a', 'c']}                          |     ${0}                    |     ${0.5}
        ${['a', 'd']}                          |     ${0}                    |     ${0.5}
        ${['a', 'e']}                          |     ${1}                    |     ${1}
        ${['a', 'b', 'c']}                     |     ${0}                    |     ${0}
        ${['a', 'b', 'd']}                     |     ${0}                    |     ${0}
        ${['a', 'b', 'e']}                     |     ${0}                    |     ${0.5}
        ${['a', 'b', 'c', 'd']}                |     ${0}                    |     ${0}
        ${['a', 'b', 'c', 'e']}                |     ${0}                    |     ${0}
        ${['a', 'b', 'c', 'd', 'e']}           |     ${0}                    |     ${0}
        ${['a', 'c', 'd', 'e']}                |     ${0}                    |     ${0}
        ${['a', 'd', 'e']}                     |     ${0}                    |     ${0.5}
      `('session = $sessionValue; partial scoring = true => score = $expectedPartialScoring / partial scoring = false => score = $expectedDychotomous',
      async ({ sessionValue, expectedPartialScoring, expectedDychotomous }) => {
        const q = {
          choiceMode: 'checkbox',
          choices: [
            { label: 'a', value: 'a', correct: true },
            { label: 'b', value: 'b' },
            { label: 'c', value: 'c' },
            { label: 'd', value: 'd' },
            { label: 'e', value: 'e', correct: true },
          ]
        };

        const resultPS = await outcome(q, { value: sessionValue }, { mode: 'evaluate ' });

        expect(resultPS.score).toEqual(expectedPartialScoring);

        const resultD = await outcome(
          { ...q, partialScoring: false },
          { value: sessionValue },
          { mode: 'evaluate ' }
        );

        expect(resultD.score).toEqual(expectedDychotomous);
      });
  });

  describe('outcome', () => {
    it('returns score of 0', async () => {
      const result = await outcome(
        question,
        { value: ['banana'] },
        { mode: 'gather' }
      );
      expect(result.score).toEqual(0);
    });

    it('returns score of 1', async () => {
      const result = await outcome(
        question,
        { value: ['apple'] },
        { mode: 'gather' }
      );
      expect(result.score).toEqual(1);
    });

    describe('partial scoring', () => {
      describe('choiceMode:radio is disabled', () => {
        it('with defaults', async () => {
          const result = await outcome(question, {}, {});
          expect(result.score).toEqual(0);
        });
        it('with defaults and correct', async () => {
          const result = await outcome(question, { value: ['apple'] }, {});
          expect(result.score).toEqual(1);
        });
        it('with env.partialScoring: true', async () => {
          const result = await outcome(question, { partialScoring: true }, {});
          expect(result.score).toEqual(0);
        });
        it('with env.partialScoring: true + config.partialScoring: true', async () => {
          const result = await outcome(
            { ...question, partialScoring: true },
            { partialScoring: true },
            {}
          );
          expect(result.score).toEqual(0);
        });
      });

      describe('checkbox', () => {
        beforeEach(() => {
          const choices = question.choices.concat({
            value: 'c',
            correct: true
          });
          question = {
            ...question,
            choiceMode: 'checkbox',
            partialScoring: true,
            choices
          };
        });

        it.each`
        sessionValue                                                                               |     expected
        ${undefined}                                                                               |     ${0}
        ${null}                                                                                    |     ${0}
        ${[]}                                                                                      |     ${0}
        ${['apple']}                                                                               |     ${0.25}
        ${['apple', 'cherry']}                                                                     |     ${0.5}
        ${['apple', 'banana']}                                                                     |     ${0.5}
        ${['apple', 'banana', 'cherry']}                                                           |     ${0.75}
        ${['apple', 'banana', 'grapes']}                                                           |     ${0.75}
        ${['apple', 'banana', 'grapes', 'cherry']}                                                 |     ${1}
        ${['cherry', 'banana', 'grapes']}                                                          |     ${0.75}
        ${['apple', 'durian']}                                                                     |     ${0.25}
        ${['apple', 'durian', 'elderberries']}                                                     |     ${0.25}
        ${['apple', 'durian', 'feijoa', 'elderberries', 'jackfruit']}                              |     ${0}
        ${['apple', 'durian', 'feijoa', 'elderberries', 'jackfruit', 'kiwi']}                      |     ${0}
        ${['apple', 'cherry', 'durian', 'feijoa', 'elderberries', 'jackfruit', 'kiwi']}            |     ${0}
        ${['apple', 'cherry', 'durian', 'feijoa', 'elderberries', 'jackfruit', 'kiwi']}            |     ${0}
        ${['apple', 'cherry', 'banana', 'durian', 'feijoa', 'elderberries', 'jackfruit', 'kiwi']}  |     ${0}
        ${['apple', 'cherry', 'banana', 'durian', 'feijoa', 'jackfruit', 'kiwi']}                  |     ${0}
        ${['apple', 'cherry', 'banana', 'grapes', 'durian', 'jackfruit', 'kiwi']}                  |     ${0.25}
        ${['apple', 'cherry', 'banana', 'grapes', 'durian', 'jackfruit']}                          |     ${0.5}
        ${['apple', 'cherry', 'banana', 'grapes', 'durian']}                                       |     ${0.75}
      `('outcome: partial scoring = true, sessionValue = $sessionValue => expected = $expected',
          async ({ sessionValue, expected }) => {
            const q = {
              choiceMode: 'checkbox',
              choices: [
                { label: 'a', value: 'apple', correct: true },
                { label: 'b', value: 'banana', correct: true },
                { label: 'c', value: 'cherry', correct: true },
                { label: 'd', value: 'durian' },
                { label: 'e', value: 'elderberries' },
                { label: 'f', value: 'feijoa' },
                { label: 'g', value: 'grapes', correct: true },
                { label: 'j', value: 'jackfruit' },
                { label: 'k', value: 'kiwi' },
              ]
            };


            const result = await outcome(q, { value: sessionValue }, { mode: 'evaluate ' });
            expect(result.score).toEqual(expected);
          });
      });
    });

    it.each`
    session         |     empty
    ${undefined}    |     ${true}
    ${null}         |     ${true}
    ${{}}           |     ${true}
    ${{ value: [] }}|     ${false}
    `('returns score: 0 and empty: true if session is $session', async ({ session, empty }) => {
      const o = await outcome(question, session, { mode: 'evaluate' });

      expect(o).toEqual({ score: 0, empty });
    });
  });

  describe('correct response', () => {
    it('returns correct response if env is correct', async () => {
      const sess = await createCorrectResponseSession(question, { mode: 'gather', role: 'instructor' });
      expect(sess).toEqual({ 'id': '1', 'value': ['apple'] });
    });

    it('returns null env is student', async () => {
      const noResult = await createCorrectResponseSession(question, { mode: 'gather', role: 'student' });
      expect(noResult).toBeNull();
    });
  });

  describe('normalize', () => {
    it('sets choicesLayout: horizontal if verticalMode: false', async () => {
      const sess = await normalize({ ...question, verticalMode: false });

      expect(sess).toEqual({ ...defaults, ...question, choicesLayout: 'horizontal' });
    });

    it('sets choicesLayout: vertical if verticalMode: true', async () => {
      const sess = await normalize({ ...question, verticalMode: true });

      expect(sess).toEqual({ ...defaults, ...question, choicesLayout: 'vertical' });
    });

    it('sets choicesLayout: grid if verticalMode: true && choicesLayout: grid', async () => {
      const sess = await normalize({ ...question, verticalMode: true, choicesLayout: 'grid' });

      expect(sess).toEqual({ ...defaults, ...question, choicesLayout: 'grid' });
    });

    it('sets choicesLayout: vertical', async () => {
      const sess = await normalize(question);

      expect(sess).toEqual({ ...defaults, ...question, choicesLayout: 'vertical' });
    });
  });
});
