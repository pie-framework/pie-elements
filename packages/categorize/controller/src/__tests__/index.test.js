import {
  model,
  outcome,
  getCorrectness,
  getScore,
  getTotalScore,
  createCorrectResponseSession
} from '../index';
import { buildState, score } from '@pie-lib/categorize';

const categorize = require('@pie-lib/categorize');

const categories = () => [{ id: '1', label: 'One' }];

const choices = () => [
  { id: '1', content: 'Foo' },
  { id: '2', content: 'Bar' }
];

const mkQuestion = extras => ({
  categories: categories(),
  choices: choices(),
  correctResponse: [{ category: '1', choices: ['1', '2'] }],
  lockChoiceOrder: true,
  ...extras
});

describe('controller', () => {
  let question;
  let result;
  const buildStateSpy = jest.spyOn(categorize, 'buildState');

  beforeEach(() => {
    question = {
      categories: categories(),
      choices: choices(),
      correctResponse: [{ category: '1', choices: ['1', '2'] }],
      lockChoiceOrder: true
    };
  });

  describe('getCorrectness', () => {
    describe('mode: gather', () => {
      it('resolves undefined', () => {
        expect(
          getCorrectness(question, {}, { mode: 'gather' })
        ).resolves.toEqual(undefined);
      });
    });

    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        const session = { id: '1', element: 'categorize-element' };
        const env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model(
          {
            id: '1',
            element: 'categorize-element',
            ...question,
            lockChoiceOrder: false
          },
          session,
          env,
          updateSession
        );
        expect(updateSession).toHaveBeenCalledWith('1', 'categorize-element', {
          shuffledValues: expect.arrayContaining(['1', '2'])
        });
      });
    });

    describe('mode: view', () => {
      it('resolves undefined', () => {
        expect(
          getCorrectness(question, {}, { mode: 'gather' })
        ).resolves.toEqual(undefined);
      });
    });

    describe('mode: evaluate', () => {
      let correctness;

      beforeEach(() => {
        correctness = getCorrectness(question, {}, { mode: 'evaluate' });
      });

      it('calls buildState ', () => {
        expect(buildStateSpy).toBeCalled();
      });

      const returnCorrectness = session => {
        it(`resolves incorrect if session is ${JSON.stringify(
          session
        )}`, () => {
          expect(
            getCorrectness(question, session, { mode: 'evaluate' })
          ).resolves.toEqual('incorrect');
        });
      };

      returnCorrectness(undefined);
      returnCorrectness(null);
      returnCorrectness({});

      it('resolves incorrect', () => {
        expect(
          getCorrectness(
            question,
            {},
            {
              mode: 'evaluate'
            }
          )
        ).resolves.toEqual('incorrect');
      });

      it('resolves correct', () => {
        expect(
          getCorrectness(
            question,
            {
              answers: [
                {
                  category: '1',
                  choices: ['1', '2']
                }
              ]
            },
            {
              mode: 'evaluate'
            }
          )
        ).resolves.toEqual('correct');
      });

      it('resolves partially-correct', () => {
        expect(
          getCorrectness(
            { ...question, partialScoring: true },
            {
              answers: [
                {
                  category: '1',
                  choices: ['1']
                }
              ]
            },
            {
              mode: 'evaluate'
            }
          )
        ).resolves.toEqual('partially-correct');
      });
    });
  });

  describe('outcome', () => {
    describe('mode: gather', () => {
      it('rejects with an error for gather', () => {
        expect(outcome(question, {}, { mode: 'gather' })).rejects.toEqual(
          expect.any(Error)
        );
      });
    });

    describe('mode: view', () => {
      it('rejects with an error for gather', () => {
        expect(outcome(question, {}, { mode: 'view' })).rejects.toEqual(
          expect.any(Error)
        );
      });
    });

    describe('mode: evaluate', () => {
      beforeEach(() => {
        outcome(question, {}, { mode: 'evaluate' });
      });

      it('calls buildState ', () => {
        expect(buildStateSpy).toBeCalled();
      });

      const assertGetCorrectness = session => {
        it(`returns empty: true if session is ${JSON.stringify(
          session
        )}`, () => {
          expect(
            getCorrectness(question, session, { mode: 'evaluate' })
          ).resolves.toEqual('incorrect');
        });
      };

      assertGetCorrectness(undefined);
      assertGetCorrectness(null);
      assertGetCorrectness({});

      it('returns empty: false when session is defined', async () => {
        expect(
          await outcome(question, { id: 1 }, { mode: 'evaluate' })
        ).toEqual({ score: 0, empty: false });
      });
    });

    it.each`
      model        | env          | score
      ${undefined} | ${undefined} | ${0.5}
      ${true}      | ${undefined} | ${0.5}
      ${undefined} | ${true}      | ${0.5}
      ${false}     | ${true}      | ${0}
      ${true}      | ${false}     | ${0}
      ${false}     | ${undefined} | ${0}
      ${undefined} | ${false}     | ${0}
      ${false}     | ${false}     | ${0}
    `(
      'model: $model, env: $env => score: $score',
      async ({ model, env, score }) => {
        const sessionValue = { answers: [{ category: '1', choices: ['1'] }] };
        const result = await outcome(
          { ...question, partialScoring: model },
          sessionValue,
          { mode: 'evaluate', partialScoring: env }
        );
        expect(result).toEqual(expect.objectContaining({ score }));
      }
    );
  });

  describe('model', () => {
    it('returns model', async () => {
      const result = await model(question, {}, { mode: 'gather' });
      expect(result).toMatchObject({ ...question, correctResponse: undefined });
    });

    describe('disabled', () => {
      it('disabled false for gather', async () => {
        const result = await model(question, {}, { mode: 'gather' });
        expect(result).toMatchObject({ disabled: false });
      });

      it('disabled true for view', async () => {
        const result = await model(question, {}, { mode: 'view' });
        expect(result).toMatchObject({ disabled: true });
      });

      it('disabled true for evaluate', async () => {
        const result = await model(question, {}, { mode: 'evaluate' });
        expect(result).toMatchObject({ disabled: true });
      });
    });

    it('adds correctResponse for evaluate', async () => {
      const result = await model(question, {}, { mode: 'evaluate' });
      expect(result).toMatchObject({
        correctResponse: [{ category: '1', choices: ['1', '2'] }]
      });
    });

    it('adds default config', async () => {
      const result = await model(question, {}, { mode: 'gather' });
      expect(result).toMatchObject({
        choicesPerRow: 2,
        categoriesPerRow: 2,
        choicesLabel: ''
      });
    });
  });

  describe('getScore', () => {
    it('returns correct result', () => {
      expect(
        getScore(
          { id: '0' },
          [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }],
          ['0', '1', '3'],
          ['0', '2']
        )
      ).toEqual(0.25);

      expect(
        getScore(
          { id: '0' },
          [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }],
          ['0'],
          ['0', '2']
        )
      ).toEqual(0.75);
    });
  });

  describe('getTotalScore', () => {
    const returnScore = session => {
      it(`returns 0 if session is ${JSON.stringify(session)}`, () => {
        expect(
          getCorrectness(question, session, { mode: 'evaluate' })
        ).resolves.toEqual('incorrect');
      });
    };

    returnScore(undefined);
    returnScore(null);
    returnScore({});
  });

  describe('correct response', () => {
    it('returns correct response if env is correct', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'instructor'
      });
      expect(sess).toEqual({
        answers: [
          {
            category: '1',
            choices: ['1', '2']
          }
        ],
        id: 1
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
