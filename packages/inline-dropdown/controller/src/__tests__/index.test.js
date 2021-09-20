import {
  getScore,
  outcome,
  createCorrectResponseSession,
  model,
} from '../index';

describe('inline-dropdown', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      lockChoiceOrder: false,
      choices: {
        '0': [
          {
            correct: false,
            value: '9719395',
            label: '20,000',
          },
          {
            correct: false,
            value: '9719396',
            label: '17,000',
          },
          {
            correct: false,
            value: '9719397',
            label: '16,100',
          },
          {
            correct: true,
            value: '9719398',
            label: '16,000',
            rationale: 'rationale for choice'
          },
        ],
      },
      element: 'inline-dropdown-element',
      rationale: '',
      prompt:
        '<p>\n  <strong><span style="color: #000000; font-family: Arial;">El número 16,101</span></strong> <strong><span style="color: #000000; font-family: Arial;">redondeado al</span></strong> <strong><span style="color: #000000; font-family: Arial;">millar más cercano es&nbsp;______________.</span></strong>\n</p>\n<p>\n  <strong><span style="color: #000000;">&nbsp;</span></strong>\n</p>',
      scoringType: 'auto',
      teacherInstructions: true,
      studentInstructions: false,
      partialScoring: false,
      markup: '{{0}}',
      id: '2421310',
      alternateResponses: null,
    };
  });

  describe('edge cases', () => {
    it('is ok is session is empty', async () => {
      session = {};
      env = { mode: 'evaluate' };
      const r = await model(question, {}, { mode: 'evaluate' });
      expect(r).toBeDefined();
    });
  });

  describe('model - with updateSession', () => {
    it('calls updateSession', async () => {
      session = { id: '1', element: 'inline-dropdown-element' };
      env = { mode: 'gather' };
      const updateSession = jest.fn().mockResolvedValue();
      await model(question, session, env, updateSession);
      expect(updateSession).toHaveBeenCalledWith(
        '1',
        'inline-dropdown-element',
        {
          shuffledValues: expect.arrayContaining([
            '9719395',
            '9719396',
            '9719397',
            '9719398',
          ]),
        }
      );
    });
  });
});

const question = {
  prompt: 'Use the drop-downs to complete the sentence',
  markup: '<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>',
  choices: {
    '0': [
      {
        label: 'cow ',
        value: '0',
        correct: true,
        rationale: 'rationale cow'
      },
      {
        label: 'dog ',
        value: '1',
        correct: false,
        rationale: 'rationale dog'
      },
      {
        label: 'cat ',
        value: '2',
        correct: false,
        rationale: 'rationale cat'
      },
    ],
    '1': [
      {
        label: 'over ',
        value: '0',
        correct: true,
        rationale: 'rationale over'
      },
      {
        label: 'under ',
        value: '1',
        correct: false,
        rationale: 'rationale under'
      },
      {
        label: 'across ',
        value: '2',
        correct: false,
        rationale: 'rationale across'
      },
    ],
    '2': [
      {
        label: 'moon ',
        value: '0',
        correct: true,
        rationale: 'rationale moon'
      },
      {
        label: 'sun',
        value: '2',
        correct: false,
        rationale: 'rationale sun'
      },
      {
        label: 'house ',
        value: '3',
        correct: false,
        rationale: 'rationale house'
      },
    ],
  },
};

describe('controller', () => {
  describe('model', () => {
    let q;
    const updateSession = jest.fn().mockResolvedValue();

    it('output when session is defined', async () => {
      const m = await model(
        question,
        { value: { 0: '0', 1: '0', 2: '0' } },
        { mode: 'evaluate' },
        updateSession
      );

      expect(m).toEqual(
        expect.objectContaining({
          feedback: { 0: 'correct', 1: 'correct', 2: 'correct' },
          responseCorrect: true,
        })
      );
    });

    const returnModel = (session) => {
      it(`output when session is ${JSON.stringify(session)}`, async () => {
        const m = await model(
          question,
          session,
          { mode: 'evaluate' },
          updateSession
        );

        expect(m).toEqual(
          expect.objectContaining({
            feedback: { 0: 'incorrect', 1: 'incorrect', 2: 'incorrect' },
            responseCorrect: false,
          })
        );
      });
    };

    returnModel(undefined);
    returnModel(null);
    returnModel({});

    const choicesWithNullRationale = {
      '0': [
        {
          label: 'cow ',
          value: '0',
          correct: true,
          rationale: null
        },
        {
          label: 'dog ',
          value: '1',
          correct: false,
          rationale: null
        },
        {
          label: 'cat ',
          value: '2',
          correct: false,
          rationale: null
        },
      ],
      '1': [
        {
          label: 'over ',
          value: '0',
          correct: true,
          rationale: null
        },
        {
          label: 'under ',
          value: '1',
          correct: false,
          rationale: null
        },
        {
          label: 'across ',
          value: '2',
          correct: false,
          rationale: null
        },
      ],
      '2': [
        {
          label: 'moon ',
          value: '0',
          correct: true,
          rationale: null
        },
        {
          label: 'sun',
          value: '2',
          correct: false,
          rationale: null
        },
        {
          label: 'house ',
          value: '3',
          correct: false,
          rationale: null
        }
      ]
    };


    const assertGather = (label, extra, session, expected) => {
      it(`'mode: gather, ${label}'`, async () => {

        q = {
          ...question,
          alternateResponse: { '2': ['2'] },
          lockChoiceOrder: true,
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra,
        };
        const result = await model(
          q,
          {
            id: '1',
            element: 'explicit-constructed-response',
            ...session,
          },
          { mode: 'gather' },
          updateSession
        );

        expect(result).toEqual({
          ...question,
          disabled: false,
          mode: 'gather',
          feedback: {},
          responseCorrect: undefined,
          choices: choicesWithNullRationale,
          ...expected,
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
      }
    );

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
      }
    );

    const assertView = (label, extra, session, expected) => {
      it(`'mode: view, ${label}'`, async () => {
        q = {
          ...question,
          alternateResponse: { '2': ['2'] },
          lockChoiceOrder: true,
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra,
        };
        const result = await model(
          q,
          { id: '1', element: 'explicit-constructed-response', ...session },
          { mode: 'view', role: 'instructor' },
          updateSession
        );

        expect(result).toEqual({
          ...question,
          mode: 'view',
          disabled: true,
          feedback: {},
          responseCorrect: undefined,
          ...expected,
        });
      });
    };

    assertView(
      ' + role: instructor, promptEnabled, rationaleEnabled, teacherInstructionsEnabled and choiceRationaleEnabled set to false',
      {
        promptEnabled: false,
        rationaleEnabled: false,
        teacherInstructionsEnabled: false,
        studentInstructionsEnabled: false,
        choiceRationaleEnabled: false
      },
      {},
      {
        prompt: null,
        rationale: null,
        teacherInstructions: null,
        choices: choicesWithNullRationale
      }
    );

    assertView(
      ' + role: instructor, promptEnabled, rationaleEnabled, teacherInstructionsEnabled and choiceRationaleEnabled unset',
      {},
      {},
      {
        teacherInstructions: 'Teacher Instructions',
        rationale: 'Rationale'
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
          ...extra,
        };
        const result = await model(
          q,
          { id: '1', element: 'explicit-constructed-response', ...session },
          { mode: 'view', role: 'student' }
        );

        expect(result).toEqual({
          ...question,
          mode: 'view',
          disabled: true,
          feedback: {},
          responseCorrect: undefined,
          choices: choicesWithNullRationale,
          ...expected,
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
        teacherInstructions: null,
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
          choiceRationaleEnabled: true,
          ...extra,
        };
        const result = await model(
          q,
          { id: '1', element: 'explicit-constructed-response', ...session },
          { mode: 'evaluate', role: 'instructor' },
          updateSession
        );

        expect(result).toEqual({
          ...question,
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          mode: 'evaluate',
          disabled: true,
          ...expected,
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
          2: '0',
        },
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
          2: '1',
        },
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
          2: '2',
        },
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
          2: '1',
        },
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

  describe('outcome partialScoring test', () => {
    const assertOutcome = (message, extra, sessionValue, env, expected) => {
      it(message, async () => {
        const result = await outcome(
          {
            ...question,
            ...extra,
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
      { value: { 0: '0', 1: '0', 2: '1' } },
      { mode: 'evaluate' },
      { score: 0.67 }
    );

    assertOutcome(
      'element.partialScoring = false',
      { partialScoring: false },
      { value: { 0: '0', 1: '0', 2: '1' } },
      { mode: 'evaluate' },
      { score: 0 }
    );

    assertOutcome(
      'element.partialScoring = false, env.partialScoring = true',
      { partialScoring: false },
      { value: { 0: '0', 1: '0', 2: '1' } },
      { mode: 'evaluate', partialScoring: true },
      { score: 0 }
    );

    assertOutcome(
      'element.partialScoring = true, env.partialScoring = false',
      { partialScoring: true },
      { value: { 0: '0', 1: '0', 2: '1' } },
      { mode: 'evaluate', partialScoring: false },
      { score: 0 }
    );
  });

  describe('outcome', () => {
    const assertOutcome = (partialScoring, sessionValue, expected) => {
      it(`partial score ${
        partialScoring ? 'enabled' : 'disabled'
      }`, async () => {
        const result = await outcome(
          {
            ...question,
            partialScoring,
          },
          sessionValue
        );

        expect(result).toEqual(expected);
      });
    };

    assertOutcome(
      true,
      { value: { 0: '0', 1: '0', 2: '0' } },
      { score: 1, empty: false }
    );
    assertOutcome(
      true,
      { value: { 0: '0', 1: '0', 2: '1' } },
      { score: 0.67, empty: false }
    );
    assertOutcome(
      true,
      { value: { 0: '0', 1: '1', 2: '1' } },
      { score: 0.33, empty: false }
    );
    assertOutcome(
      true,
      { value: { 0: '1', 1: '1', 2: '1' } },
      { score: 0, empty: false }
    );

    assertOutcome(
      false,
      { value: { 0: '0', 1: '0', 2: '0' } },
      { score: 1, empty: false }
    );
    assertOutcome(
      false,
      { value: { 0: '0', 1: '0', 2: '1' } },
      { score: 0, empty: false }
    );
    assertOutcome(
      false,
      { value: { 0: '0', 1: '1', 2: '1' } },
      { score: 0, empty: false }
    );
    assertOutcome(
      false,
      { value: { 0: '1', 1: '1', 2: '1' } },
      { score: 0, empty: false }
    );

    const returnModel = (session) => {
      it(`empty: true when session is ${JSON.stringify(session)}`, async () => {
        const m = await outcome(question, session);

        expect(m).toEqual(expect.objectContaining({ score: 0, empty: true }));
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
        role: 'instructor',
      });

      expect(sess).toEqual({ id: '1', value: { 0: '0', 1: '0', 2: '0' } });
    });

    it('returns correct response if role is instructor and mode is view', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'view',
        role: 'instructor',
      });

      expect(sess).toEqual({ id: '1', value: { 0: '0', 1: '0', 2: '0' } });
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
});
