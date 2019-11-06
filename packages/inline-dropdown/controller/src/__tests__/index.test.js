import { getScore, outcome, createCorrectResponseSession, model } from '../index';

const question = {
  prompt: 'Use the drop-downs to complete the sentence',
  shuffle: true,
  markup: '<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>',
  choices: {
    '0': [
      {
        label: 'cow ',
        value: '0',
        correct: true
      },
      {
        label: 'dog ',
        value: '1',
        correct: false
      },
      {
        label: 'cat ',
        value: '2',
        correct: false
      }
    ],
    '1': [
      {
        label: 'over ',
        value: '0',
        correct: true
      },
      {
        label: 'under ',
        value: '1',
        correct: false
      },
      {
        label: 'across ',
        value: '2',
        correct: false
      }
    ],
    '2': [
      {
        label: 'moon ',
        value: '0',
        correct: true
      },
      {
        label: 'sun',
        value: '2',
        correct: false
      },
      {
        label: 'house ',
        value: '3',
        correct: false
      }
    ]
  }
};

describe('controller', () => {
  describe('model', () => {
    let q;

    it('output when session is defined', async () => {
      const m = await model(question,
        { value: { 0: '0', 1: '0', 2: '0' } },
        { mode: 'evaluate' },
        jest.fn()
      );

      expect(m).toEqual(expect.objectContaining({
        feedback: { 0: 'correct', 1: 'correct', 2: 'correct' },
        responseCorrect: true
      }))
    });

    const returnModel = (session) => {
      it(`output when session is ${JSON.stringify(session)}`, async () => {
        const m = await model(question,
          session,
          { mode: 'evaluate' },
          jest.fn()
        );

        expect(m).toEqual(expect.objectContaining({
          feedback: { 0: 'incorrect', 1: 'incorrect', 2: 'incorrect' },
          responseCorrect: false
        }))
      });
    };

    returnModel(undefined);
    returnModel(null);
    returnModel({});

    const assertGather = (label, extra, session, expected) => {
      it(`'mode: gather, ${label}'`, async () => {
        q = {
          ...question,
          alternateResponse: { '2': ['2'] },
          lockChoiceOrder: true,
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(q, {
          id: '1',
          element: 'explicit-constructed-response', ...session
        }, { mode: 'gather' }, jest.fn());

        expect(result).toEqual({
          ...question,
          disabled: false,
          mode: 'gather',
          feedback: {},
          responseCorrect: undefined,
          shuffle: false,
          ...expected
        });
      });
    };

    assertGather(
      'promptEnabled, rationaleEnabled and teacherInstructionsEnabled not set',
      {},
      {},
      {
        rationale: null,
        teacherInstructions: null
      });

    assertGather(
      'promptEnabled, rationaleEnabled and teacherInstructionsEnabled set to false',
      {
        promptEnabled: false,
        rationaleEnabled: false,
        teacherInstructionsEnabled: false,
        studentInstructionsEnabled: false,
      },
      {},
      {
        prompt: null,
        rationale: null,
        teacherInstructions: null
      });

    const assertView = (label, extra, session, expected) => {
      it(`'mode: view, ${label}'`, async () => {
        q = {
          ...question,
          alternateResponse: { '2': ['2'] },
          lockChoiceOrder: true,
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(
          q,
          { id: '1', element: 'explicit-constructed-response', ...session },
          { mode: 'view', role: 'instructor' },
          jest.fn()
        );

        expect(result).toEqual({
          ...question,
          mode: 'view',
          disabled: true,
          feedback: {},
          responseCorrect: undefined,
          shuffle: false,
          ...expected
        });
      });
    };

    assertView(
      ' + role: instructor, promptEnabled, rationaleEnabled and teacherInstructionsEnabled set to false',
      {
        promptEnabled: false,
        rationaleEnabled: false,
        teacherInstructionsEnabled: false,
        studentInstructionsEnabled: false,
      },
      {},
      {
        prompt: null,
        rationale: null,
        teacherInstructions: null
      }
    );

    assertView(
      ' + role: instructor, promptEnabled, rationaleEnabled and teacherInstructionsEnabled unset',
      {},
      {},
      {
        teacherInstructions: 'Teacher Instructions',
        rationale: 'Rationale',
      }
    );

    const assertViewStudent = (label, extra, session, expected) => {
      it(`'mode: view, ${label}'`, async () => {
        q = {
          ...question,
          alternateResponse: { '2': ['2'] },
          lockChoiceOrder: true,
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(
          q,
          { id: '1', element: 'explicit-constructed-response', ...session },
          { mode: 'view', role: 'student' });

        expect(result).toEqual({
          ...question,
          mode: 'view',
          disabled: true,
          feedback: {},
          responseCorrect: undefined,
          shuffle: false,
          ...expected
        });
      });
    };

    assertViewStudent(
      ' + role: student, promptEnabled, rationaleEnabled and teacherInstructionsEnabled set to false',
      {
        promptEnabled: false,
        rationaleEnabled: false,
        teacherInstructionsEnabled: false,
        studentInstructionsEnabled: false,
      },
      {},
      {
        prompt: null,
        rationale: null,
        teacherInstructions: null
      }
    );

    assertViewStudent(
      ' + role: student, promptEnabled, rationaleEnabled and teacherInstructionsEnabled unset',
      {},
      {},
      {
        rationale: null,
        teacherInstructions: null
      }
    );

    const assertEvaluate = (label, extra, session, expected) => {
      it(`'mode: evaluate, ${label}'`, async () => {
        q = {
          ...question,
          alternateResponse: { '0': ['2'], '1': ['2'], '2': ['2'] },
          lockChoiceOrder: true,
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(
          q,
          { id: '1', element: 'explicit-constructed-response', ...session },
          { mode: 'evaluate', role: 'instructor' },
          jest.fn()
          );

        expect(result).toEqual({
          ...question,
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          mode: 'evaluate',
          disabled: true,
          shuffle: false,
          ...expected
        });
      });
    };

    assertEvaluate(
      '- correct answer',
      {},
      {
        value: {
          0: '0',
          1: '0',
          2: '0'
        }
      },
      {
        feedback: { 0: 'correct', 1: 'correct', 2: 'correct' },
        responseCorrect: true,
      }
    );

    assertEvaluate(
      '- partially correct answer',
      {},
      {
        value: {
          0: '0',
          1: '0',
          2: '1'
        }
      },
      {
        feedback: { 0: 'correct', 1: 'correct', 2: 'incorrect' },
        responseCorrect: false,
      }
    );

    assertEvaluate(
      '- partially correct answer using alternates',
      {},
      {
        value: {
          0: '2',
          1: '1',
          2: '2'
        }
      },
      {
        feedback: { 0: 'correct', 1: 'incorrect', 2: 'correct' },
        responseCorrect: false,
      }
    );

    assertEvaluate(
      '- incorrect answer',
      {},
      {
        value: {
          0: '1',
          1: '1',
          2: '1'
        }
      },
      {
        feedback: { 0: 'incorrect', 1: 'incorrect', 2: 'incorrect' },
        responseCorrect: false,
      }
    );
  });

  describe('get score', () => {
    const assertScore = (session, expected) => {
      it('return score', () => {
        const score = getScore(question, session);

        expect(score).toEqual(expected);
      });
    };

    assertScore({ value: { 0: '0', 1: '0', 2: '0' } }, 1);

    assertScore({ value: { 0: '0', 1: '0', 2: '1' } }, 0.67);
    assertScore({ value: { 0: '0', 1: '1', 2: '1' } }, 0.33);
    assertScore({ value: { 0: '1', 1: '1', 2: '1' } }, 0);

    const returnScore = (session) => {
      it(`score = 0 when session is ${JSON.stringify(session)}`, () => {
        expect(getScore(question, session)).toEqual(0);
      });
    };

    returnScore(undefined);
    returnScore(null);
    returnScore({});
  });

  describe('outcome', () => {
    const assertOutcome = (partialScoring, sessionValue, expected) => {
      it(`partial score ${partialScoring ? 'enabled' : 'disabled'}`, async () => {
        const result = await outcome({
            ...question,
            partialScoring
          },
          sessionValue
        );

        expect(result).toEqual(expected);
      });
    };

    assertOutcome(true, { value: { 0: '0', 1: '0', 2: '0' } }, { score: 1, empty: false });
    assertOutcome(true, { value: { 0: '0', 1: '0', 2: '1' } }, { score: 0.67, empty: false });
    assertOutcome(true, { value: { 0: '0', 1: '1', 2: '1' } }, { score: 0.33, empty: false });
    assertOutcome(true, { value: { 0: '1', 1: '1', 2: '1' } }, { score: 0, empty: false });

    assertOutcome(false, { value: { 0: '0', 1: '0', 2: '0' } }, { score: 1, empty: false });
    assertOutcome(false, { value: { 0: '0', 1: '0', 2: '1' } }, { score: 0, empty: false });
    assertOutcome(false, { value: { 0: '0', 1: '1', 2: '1' } }, { score: 0, empty: false });
    assertOutcome(false, { value: { 0: '1', 1: '1', 2: '1' } }, { score: 0, empty: false });

    const returnModel = (session) => {
      it(`empty: true when session is ${JSON.stringify(session)}`, async () => {
        const m = await outcome(question, session);

        expect(m).toEqual(expect.objectContaining({ score: 0, empty: true }))
      });
    };

    returnModel(undefined);
    returnModel(null);
    returnModel({});
  });


  describe('correct response', () => {
    it('returns correct response if role is instructor and mode is gather', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'instructor'
      });

      expect(sess).toEqual({ 'id': '1', 'value': { 0: '0', 1: '0', 2: '0' } });
    });

    it('returns correct response if role is instructor and mode is view', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'view',
        role: 'instructor'
      });

      expect(sess).toEqual({ 'id': '1', 'value': { 0: '0', 1: '0', 2: '0' } });
    });

    it('returns null if mode is evaluate', async () => {
      const noResult = await createCorrectResponseSession(question, { mode: 'evaluate', role: 'instructor' });

      expect(noResult).toBeNull();
    });

    it('returns null if role is student', async () => {
      const noResult = await createCorrectResponseSession(question, { mode: 'gather', role: 'student' });

      expect(noResult).toBeNull();
    });

  });
});

