import { model, outcome, createCorrectResponseSession } from '../index';

const prompt = (id, relatedAnswer) => ({
  id,
  title: `Prompt ${id}`,
  relatedAnswer,
});

const answer = (id) => ({
  id,
  title: `Answer ${id}`,
});

describe('controller', () => {
  let question, session, env;

  beforeEach(() => {
    question = {
      id: '1',
      element: 'match-list',
      prompts: [prompt(1, 1), prompt(2, 2)],
      answers: [answer(3), answer(4), answer(5)],
      config: {
        rows: [
          {
            id: 1,
            title: 'Question Text 1',
            values: [false, false],
          },
          {
            id: 2,
            title: 'Question Text 2',
            values: [false, false],
          },
        ],
        layout: 3,
        headers: ['Column 1', 'Column 2', 'Column 3'],
      },
    };
  });

  describe('model', () => {
    describe('0 issue updateSession', () => {
      it('has a 0 as the id', async () => {
        const updateSession = jest.fn().mockResolvedValue();
        session = { id: '1', element: 'match-list' };
        env = { mode: 'gather' };
        question = { ...question, prompts: [prompt(0, 0)] };
        await model(question, session, env, updateSession);

        expect(updateSession).toHaveBeenCalled();
      });
    });

    describe('mode: evaluate', () => {
      const returnCorrectness = (session) => {
        it(`returns correctness and score: 0 if session is ${JSON.stringify(
          session
        )}`, async () => {
          const m = await model(question, session, { mode: 'evaluate' });

          expect(m).toEqual(
            expect.objectContaining({
              correctness: {
                correctness: 'unanswered',
                score: '0%',
              },
            })
          );
        });
      };

      returnCorrectness(undefined);
      returnCorrectness(null);
      returnCorrectness({});
    });

    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        session = { id: '1', element: 'match-list' };
        env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model(question, session, env, updateSession);
        expect(updateSession).toHaveBeenCalledWith('1', 'match-list', {
          shuffledValues: {
            prompts: expect.arrayContaining([1, 2]),
            answers: expect.arrayContaining([3, 4, 5]),
          },
        });
      });

      it('uses shuffledValues from session if defined', async () => {
        session = {
          id: '1',
          element: 'match-list',
          shuffledValues: {
            prompts: [2, 1],
            answers: [4, 5, 3],
          },
        };
        env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        const result = await model(
          {
            ...question,
            prompts: [prompt(1, 1), prompt(2, 2)],
            answers: [answer(3), answer(4), answer(5)],
            lockChoiceOrder: false,
          },
          session,
          env,
          updateSession
        );

        expect(result.config.prompts).toEqual([prompt(2, 2), prompt(1, 1)]);
        expect(result.config.answers).toEqual([
          answer(4),
          answer(5),
          answer(3),
        ]);
      });
    });
  });

  describe('outcome partialScoring test', () => {
    const assertOutcome = (message, extra, sessionValue, env, expected) => {
      it(message, async () => {
        const result = await outcome(
          {
            ...question,
            ...extra,
            answers: [answer(1), answer(2), answer(3)],
          },
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
        value: {
          1: 1,
          2: 3,
        },
      },
      { mode: 'evaluate' },
      { score: 0.5 }
    );

    assertOutcome(
      'element.partialScoring = false',
      { partialScoring: false },
      {
        value: {
          1: 1,
          2: 3,
        },
      },
      { mode: 'evaluate' },
      { score: 0 }
    );

    assertOutcome(
      'element.partialScoring = false, env.partialScoring = true',
      { partialScoring: false },
      {
        value: {
          1: 1,
          2: 3,
        },
      },
      {
        mode: 'evaluate',
        partialScoring: true,
      },
      { score: 0 }
    );

    assertOutcome(
      'element.partialScoring = true, env.partialScoring = false',
      { partialScoring: true },
      {
        value: {
          1: 1,
          2: 3,
        },
      },
      {
        mode: 'evaluate',
        partialScoring: false,
      },
      { score: 0 }
    );
  });

  describe('outcome', () => {
    describe('mode: evaluate', () => {
      const returnOutcome = (session) => {
        it(`returns empty: true and score: 0 if session is ${JSON.stringify(
          session
        )}`, async () => {
          const o = await outcome(question, session, { mode: 'evaluate' });

          expect(o).toEqual(
            expect.objectContaining({
              score: 0,
              empty: true,
            })
          );
        });
      };

      returnOutcome(undefined);
      returnOutcome(null);
      returnOutcome({});
    });
  });
});

describe('createCorrectResponseSession', () => {
  const question = {
    prompt: 'Your prompt goes here',
    prompts: [prompt(1, 1), prompt(3, 4), prompt(4, 3), prompt(2, 2)],
    answers: [answer(1), answer(2), answer(3), answer(4), answer(5), answer(6)],
  };

  it('returns correct response if role is instructor and mode is gather', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'instructor',
    });

    expect(sess).toEqual({
      value: {
        1: 1,
        3: 4,
        4: 3,
        2: 2,
      },
      id: '1',
    });
  });

  it('returns correct response if role is instructor and mode is view', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'view',
      role: 'instructor',
    });

    expect(sess).toEqual({
      value: {
        1: 1,
        3: 4,
        4: 3,
        2: 2,
      },
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
