import {
  model,
  getScore,
  outcome,
  prepareVal,
  createCorrectResponseSession,
  prepareChoice
} from '../index';

const choice = (l, v) => ({ label: l, value: v });
const choices = {
  0: [choice('cow', '0'), choice('cattle', '1'), choice('calf', '2')],
  1: [choice('over', '0'), choice('past', '1'), choice('beyond', '2')],
  2: [choice('moon', '0')]
};

const question = {
  markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
  disabled: false,
  choices,
  prompt: 'Complete the sentence'
};

describe('controller', () => {
  describe('model', () => {
    let q;

    it('output when session is defined', async () => {
      const m = await model(question,
        { value: { 0: 'cow', 1: 'over', 2: 'moon' } },
        { mode: 'evaluate' }
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
          { mode: 'evaluate' }
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
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(q, {
          id: '1',
          element: 'explicit-constructed-response', ...session
        }, { mode: 'gather' });

        expect(result).toEqual({
          ...question,
          disabled: false,
          mode: 'gather',
          feedback: {},
          responseCorrect: undefined,
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
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(
          q,
          { id: '1', element: 'explicit-constructed-response', ...session },
          { mode: 'view', role: 'instructor' });

        expect(result).toEqual({
          ...question,
          mode: 'view',
          disabled: true,
          feedback: {},
          responseCorrect: undefined,
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
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(
          q,
          { id: '1', element: 'explicit-constructed-response', ...session },
          { mode: 'evaluate', role: 'instructor' });

        expect(result).toEqual({
          ...question,
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          mode: 'evaluate',
          disabled: true,
          choices: {
            0: [
              { label: 'cow', value: '0', correct: true },
              { label: 'cattle', value: '1' , correct: true},
              { label: 'calf', value: '2', correct: true }
            ],
            1: [
              { label: 'over', value: '0', correct: true },
              { label: 'past', value: '1', correct: true },
              { label: 'beyond', value: '2', correct: true }
            ],
            2: [{ label: 'moon', value: '0', correct: true }]
          },
          ...expected
        });
      });
    };

    assertEvaluate(
      '- correct answer',
      {},
      {
        value: {
          0: 'cow',
          1: 'over',
          2: 'moon'
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
      { value: {
          0: 'cow',
          1: 'over',
          2: 'sun'
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
      { value: {
          0: 'calf',
          1: 'over',
          2: 'sun'
        }
      },
      {
        feedback: { 0: 'correct', 1: 'correct', 2: 'incorrect' },
        responseCorrect: false,
      }
    );

    assertEvaluate(
      '- incorrect answer',
      {},
      { value: {
          0: 'han',
          1: 'above',
          2: 'chicken'
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

    assertScore({ value: { 0: 'cow', 1: 'over', 2: 'moon' } }, 1);
    assertScore({ value: { 0: 'cattle', 1: 'over', 2: 'moon' } }, 1);
    assertScore({ value: { 0: 'calf', 1: 'over', 2: 'moon' } }, 1);
    assertScore({ value: { 0: 'cow', 1: 'past', 2: 'moon' } }, 1);
    assertScore({ value: { 0: 'cattle', 1: 'past', 2: 'moon' } }, 1);
    assertScore({ value: { 0: 'calf', 1: 'past', 2: 'moon' } }, 1);
    assertScore({ value: { 0: 'cow', 1: 'beyond', 2: 'moon' } }, 1);
    assertScore({ value: { 0: 'cattle', 1: 'beyond', 2: 'moon' } }, 1);
    assertScore({ value: { 0: 'calf', 1: 'beyond', 2: 'moon' } }, 1);

    assertScore({ value: { 0: 'calf', 1: 'under', 2: 'moon' } }, 0.67);
    assertScore({ value: { 0: 'cat', 1: 'under', 2: 'moon' } }, 0.33);
    assertScore({ value: { 0: 'cat', 1: 'under', 2: 'sun' } }, 0);

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
        const result = await outcome({
            ...question,
            ...extra
          },
          sessionValue,
          env
        );

        expect(result).toEqual(expect.objectContaining(expected));
      });
    };

    assertOutcome('element.partialScoring = true',
      { partialScoring: true }, { value: { 0: 'calf', 1: 'under', 2: 'moon' } }, { mode: 'evaluate' }, { score: 0.67 });

    assertOutcome('element.partialScoring = false',
      { partialScoring: false }, { value: { 0: 'calf', 1: 'under', 2: 'moon' } }, { mode: 'evaluate' }, { score: 0 });

    assertOutcome('element.partialScoring = false, env.partialScoring = true',
      { partialScoring: false }, { value: { 0: 'calf', 1: 'under', 2: 'moon' } }, {
        mode: 'evaluate',
        partialScoring: true
      }, { score: 0.67 });

    assertOutcome('element.partialScoring = true, env.partialScoring = false',
      { partialScoring: true }, { value: { 0: 'calf', 1: 'under', 2: 'moon' } }, {
        mode: 'evaluate',
        partialScoring: false
      }, { score: 0 });
  });

  describe('outcome', () => {
    const assertOutcome = (partialScoring, sessionValue, expected) => {
      it(`partial score ${partialScoring ? 'enabled' : ''}`, async () => {
        const result = await outcome({
            ...question,
            partialScoring
          },
          sessionValue
        );

        expect(result).toEqual(expected);
      });
    };

    assertOutcome(true, { value: { 0: 'cow', 1: 'over', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(true, { value: { 0: 'cattle', 1: 'over', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(true, { value: { 0: 'calf', 1: 'over', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(true, { value: { 0: 'cow', 1: 'past', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(true, { value: { 0: 'cattle', 1: 'past', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(true, { value: { 0: 'calf', 1: 'past', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(true, { value: { 0: 'cow', 1: 'beyond', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(true, { value: { 0: 'cattle', 1: 'beyond', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(true, { value: { 0: 'calf', 1: 'beyond', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(true, { value: { 0: 'calf', 1: 'under', 2: 'moon' } }, { score: 0.67, empty: false });
    assertOutcome(true, { value: { 0: 'cat', 1: 'under', 2: 'moon' } }, { score: 0.33, empty: false });
    assertOutcome(true, { value: { 0: 'cat', 1: 'under', 2: 'sun' } }, { score: 0, empty: false });

    assertOutcome(false, { value: { 0: 'cow', 1: 'over', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(false, { value: { 0: 'cattle', 1: 'over', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(false, { value: { 0: 'calf', 1: 'over', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(false, { value: { 0: 'cow', 1: 'past', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(false, { value: { 0: 'cattle', 1: 'past', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(false, { value: { 0: 'calf', 1: 'past', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(false, { value: { 0: 'cow', 1: 'beyond', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(false, { value: { 0: 'cattle', 1: 'beyond', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(false, { value: { 0: 'calf', 1: 'beyond', 2: 'moon' } }, { score: 1, empty: false });
    assertOutcome(false, { value: { 0: 'calf', 1: 'under', 2: 'moon' } }, { score: 0, empty: false });
    assertOutcome(false, { value: { 0: 'cat', 1: 'under', 2: 'moon' } }, { score: 0, empty: false });
    assertOutcome(false, { value: { 0: 'cat', 1: 'under', 2: 'sun' } }, { score: 0, empty: false });

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

  describe('prepareVal', () => {
    it('should return empty string on null or undefined', () => {
      expect(prepareVal(null)).toEqual('');
      expect(prepareVal(undefined)).toEqual('');
    });

    it('should remove html tags', () => {
      expect(prepareVal('<div>Foo Bar</div>')).toEqual('Foo Bar');
    });

    describe('correct response', () => {
      let question;
      beforeEach(() => {
        question = {
          choices,
        };
      });

      it('returns correct response if env is correct', async () => {
        const sess = await createCorrectResponseSession(question, {
          mode: 'gather',
          role: 'instructor'
        });
        expect(sess).toEqual({ 'id': '1', 'value': { '0': 'cow', '1': 'over', '2': 'moon' } });
      });

      it('returns null env is student', async () => {
        const noResult = await createCorrectResponseSession(question, { mode: 'gather', role: 'student' });
        expect(noResult).toBeNull();
      });
    });
  });

  describe('correct response', () => {
    it('returns correct response if role is instructor and mode is gather', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'instructor'
      });

      expect(sess).toEqual({ 'id': '1', 'value': { 0: 'cow', 1: 'over', 2: 'moon' } });
    });

    it('returns correct response if role is instructor and mode is view', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'view',
        role: 'instructor'
      });

      expect(sess).toEqual({ 'id': '1', 'value': { 0: 'cow', 1: 'over', 2: 'moon' } });
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

  describe('prepareChoice', () => {
    const assertPrepareChoice = (env, defaultFeedback, choice, expected) => {
      const preparChoiceFn = prepareChoice(env.mode, defaultFeedback);

      it(`prepare choices in ${env.mode} mode: ${JSON.stringify(choice)} -> ${JSON.stringify(expected)}`, () => {
        expect(preparChoiceFn(choice)).toEqual(expected);
      });
    };

    assertPrepareChoice(
      { mode: 'gather' },
      { correct: 'Correct', incorrect: 'Incorrect' },
      { value: '0', label: 'cow'},
      { value: '0', label: 'cow' }
      );

    assertPrepareChoice(
      { mode: 'view' },
      { correct: 'Correct', incorrect: 'Incorrect' },
      { value: '0', label: 'cow'},
      { value: '0', label: 'cow' }
      );

    assertPrepareChoice(
      { mode: 'evaluate' },
      { correct: 'Correct', incorrect: 'Incorrect' },
      { value: '0', label: 'cow'},
      { value: '0', label: 'cow', correct: true }
      );

    assertPrepareChoice(
      { mode: 'evaluate' },
      { correct: 'Correct', incorrect: 'Incorrect' },
      { value: '0', label: 'cow', feedback: { type: 'default' }},
      { value: '0', label: 'cow', correct: true, feedback: 'Correct' }
    );

    assertPrepareChoice(
      { mode: 'evaluate' },
      { correct: 'Correct', incorrect: 'Incorrect' },
      { value: '0', label: 'cow', feedback: { type: 'custom' }},
      { value: '0', label: 'cow', correct: true, feedback: undefined }
    );

    assertPrepareChoice(
      { mode: 'evaluate' },
      { correct: 'Correct', incorrect: 'Incorrect' },
      { value: '0', label: 'cow', feedback: { type: 'custom', value: 'Custom Feedback' }},
      { value: '0', label: 'cow', correct: true, feedback: 'Custom Feedback' }
    );
  });
});
