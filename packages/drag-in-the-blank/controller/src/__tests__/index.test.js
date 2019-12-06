import { model, getScore, outcome, createCorrectResponseSession } from '../index';
import { getAllCorrectResponses, choiceIsEmpty } from '../utils';

const choice = (v, id) => ({ value: v, id });

describe('controller', () => {
  let question, session, env;

  beforeEach(() => {
    question = {
      id: '1',
      element: 'drag-in-the-blank',
      prompt: '<p>Solve the equation below.</p>',
      choicesPosition: 'below',
      correctResponse: {
        '0': '0',
        '1': '1'
      },
      duplicates: true,
      alternateResponses : [
        ['1'],
        ['0']
      ]
    };
  });

  describe('model', () => {
    let q;

    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        session = { id: '1', element: 'drag-in-the-blank' };
        env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model({
          ...question,
          choices: [
            choice('<div>6</div>', '0'),
            choice('<div>9</div>', '1')
          ]},
          session,
          env,
          updateSession
        );
        expect(updateSession).toHaveBeenCalledWith('1', 'drag-in-the-blank', {
          shuffledValues: expect.arrayContaining(['0', '1'])
        });
      });
    });

    const assertGather = (label, extra, session, expected) => {
      it(`'mode: gather, ${label}'`, async () => {
        q = {
          ...question,
          choices: [
            choice('<div>6</div>', '0'),
            choice('<div>9</div>', '1'),
            choice('', '2')
          ],
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(q, { id: '1', element: 'drag-in-the-blank', ...session }, { mode: 'gather' }, jest.fn());

        expect(result).toEqual({
          ...q,
          choices: expect.arrayContaining([
            choice('<div>6</div>', '0'),
            choice('<div>9</div>', '1')
          ]),
          mode: 'gather',
          disabled: false,
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
        prompt: '<p>Solve the equation below.</p>',
        rationale: null,
        teacherInstructions: null,
        promptEnabled: true,
        rationaleEnabled: true,
        teacherInstructionsEnabled: true,
        studentInstructionsEnabled: true
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
        teacherInstructions: null,
        promptEnabled: false,
        rationaleEnabled: false,
        teacherInstructionsEnabled: false,
        studentInstructionsEnabled: false
      });

    const assertView = (label, extra, session, expected) => {
      it(`'mode: view, ${label}'`, async () => {
        q = {
          ...question,
          choices: [
            choice('<div>6</div>', '0'),
            choice('<div>9</div>', '1'),
            choice('', '2')
          ],
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(
          q,
          { id: '1', element: 'drag-in-the-blank', ...session },
          { mode: 'view', role: 'instructor' },
          jest.fn());

        expect(result).toEqual({
          ...q,
          choices: expect.arrayContaining([
            choice('<div>6</div>', '0'),
            choice('<div>9</div>', '1')
          ]),
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
        teacherInstructions: null,
        promptEnabled: false,
        rationaleEnabled: false,
        teacherInstructionsEnabled: false,
        studentInstructionsEnabled: false
      }
    );

    assertView(
      ' + role: instructor, promptEnabled, rationaleEnabled and teacherInstructionsEnabled unset',
      {},
      {},
      {
        promptEnabled: true,
        rationaleEnabled: true,
        teacherInstructionsEnabled: true,
        studentInstructionsEnabled: true
      }
    );

    const assertViewStudent = (label, extra, session, expected) => {
      it(`'mode: view, ${label}'`, async () => {
        q = {
          ...question,
          choices: [
            choice('<div>6</div>', '0'),
            choice('<div>9</div>', '1'),
            choice('', '2')
          ],
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(
          q,
          { id: '1', element: 'drag-in-the-blank', ...session },
          { mode: 'view', role: 'student' },
          jest.fn());

        expect(result).toEqual({
          ...q,
          choices: expect.arrayContaining([
            choice('<div>6</div>', '0'),
            choice('<div>9</div>', '1')
          ]),
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
        teacherInstructions: null,
        promptEnabled: false,
        rationaleEnabled: false,
        teacherInstructionsEnabled: false,
        studentInstructionsEnabled: false
      }
    );

    assertViewStudent(
      ' + role: student, promptEnabled, rationaleEnabled and teacherInstructionsEnabled unset',
      {},
      {},
      {
        rationale: null,
        teacherInstructions: null,
        promptEnabled: true,
        rationaleEnabled: true,
        teacherInstructionsEnabled: true,
        studentInstructionsEnabled: true
      }
    );

    const assertEvaluate = (label, extra, session, expected) => {
      it(`'mode: evaluate, ${label}'`, async () => {
        q = {
          ...question,
          choices: [
            choice('<div>6</div>', '0'),
            choice('<div>9</div>', '1'),
            choice('', '2')
          ],
          teacherInstructions: 'Teacher Instructions',
          rationale: 'Rationale',
          ...extra
        };
        const result = await model(
          q,
          { id: '1', element: 'drag-in-the-blank', ...session },
          { mode: 'evaluate', role: 'instructor' },
          jest.fn());

        expect(result).toEqual({
          ...q,
          choices: expect.arrayContaining([
            choice('<div>6</div>', '0'),
            choice('<div>9</div>', '1')
          ]),
          mode: 'evaluate',
          disabled: true,
          promptEnabled: true,
          rationaleEnabled: true,
          teacherInstructionsEnabled: true,
          studentInstructionsEnabled: true,
          ...expected
        });
      });
    };

    assertEvaluate(
      '- correct answer',
      {},
      { value: { 0: '1', 1: '0' } },
      {
        feedback: { 0: true, 1: true },
        responseCorrect: true,
      }
    );

    assertEvaluate(
      '- partially correct answer',
      {},
      { value: { 0: '1', 1: '1' } },
      {
        feedback: { 0: false, 1: true },
        responseCorrect: false,
      }
    );

    assertEvaluate(
      '- partially correct answer using alternates',
      {},
      { value: { 0: '2', 1: '0' } },
      {
        feedback: { 0: false, 1: true },
        responseCorrect: false,
      }
    );

    assertEvaluate(
      '- incorrect answer',
      {},
      { value: { 0: '2', 1: '2' } },
      {
        feedback: { 0: false, 1: false },
        responseCorrect: false,
      }
    );

    it('returns expected model when session is undefined', async () => {
      const m = await model(question, undefined, { mode: 'evaluate' }, jest.fn());

      expect(m).toEqual(expect.objectContaining({
        ...question,
        responseCorrect: false,
      }));
    });

    it('returns expected model when session is null', async () => {
      const m = await model(question, null, { mode: 'evaluate' }, jest.fn());

      expect(m).toEqual(expect.objectContaining({
        ...question,
        responseCorrect: false,
      }));
    });

    it('returns expected model when session is empty', async () => {
      const m = await model(question, {}, { mode: 'evaluate' }, jest.fn());

      expect(m).toEqual(expect.objectContaining({
        ...question,
        responseCorrect: false,
      }));
    });
  });

  const config = {
    choices: [
      choice('<div>6</div>', '0'),
      choice('<div>9</div>', '1'),
      choice('<div>1</div>', '2'),
      choice('<div>2</div>', '3'),
      choice('<div>3</div>', '4'),
      choice('<div>4</div>', '5'),
      choice('<div>5</div>', '6'),
      choice('<div>7</div>', '7'),
      choice('<div>8</div>', '8'),
      choice('<div>10</div>', '9'),
      choice('<div>11</div>', '10'),
    ],
    correctResponse: {
      '0': '0',
      '1': '1'
    },
    alternateResponses : [
      ['1', '5', '10', '6', '9', '7', '8'],
      ['0', '10', '5', '9', '6', '8', '7']
    ],
  };

  describe('get score', () => {
    const assertScore = (session, expected) => {
      it('return score', () => {
        const score = getScore(config, session);

        expect(score).toEqual(expected);
      });
    };

    assertScore({ value: { 0: '1', 1: '0' }}, 1);
    assertScore({ value: { 0: '0', 1: '1' }}, 1);
    assertScore({ value: { 0: '5', 1: '10' }}, 1);
    assertScore({ value: { 0: '10', 1: '5' }}, 1);
    assertScore({ value: { 0: '6', 1: '9' }}, 1);
    assertScore({ value: { 0: '9', 1: '6' }}, 1);
    assertScore({ value: { 0: '8', 1: '7' }}, 1);
    assertScore({ value: { 0: '7', 1: '8' }}, 1);
    assertScore({ value: { 0: '1', 1: '1' }}, 0.5);
    assertScore({ value: { 0: '7', 1: '7' }}, 0.5);
    assertScore({ value: { 0: '8', 1: '8' }}, 0.5);
    assertScore({ value: { 0: '2', 1: '3' }}, 0);
    assertScore({ value: { 0: '3', 1: '4' }}, 0);

    it('returns expected score when session is undefined', () => {
      expect(getScore(question, undefined)).toEqual(0);
    });

    it('returns expected score when session is null',  () => {
      expect(getScore(question, null)).toEqual(0);
    });

    it('returns expected score when session is empty', () => {
      expect(getScore(question, {})).toEqual(0);
    });
  });

  describe('getScore partialScoring test', () => {
    const assertOutcome = (message, partialScoring, sessionValue, env, expected) => {
      it(message, async () => {
        const result = await outcome({
            ...config,
            partialScoring
          },
          { value: sessionValue },
          env
        );

        expect(result).toEqual(expect.objectContaining(expected));
      });
    };

    assertOutcome('element.partialScoring = true',
      true, { 0: '1', 1: '1' }, { mode: 'evaluate' }, { score: 0.5 });

    assertOutcome('element.partialScoring = false',
      false, { 0: '3', 1: '4' }, { mode: 'evaluate' }, { score: 0 });

    assertOutcome('element.partialScoring = false, env.partialScoring = true',
      false, { 0: '1', 1: '1' }, { mode: 'evaluate', partialScoring: true }, { score: 0.5 });

    assertOutcome('element.partialScoring = true, env.partialScoring = false',
      true, { 0: '1', 1: '1' }, { mode: 'evaluate', partialScoring: false }, { score: 0 });
  });

  describe('outcome', () => {
    const assertOutcome = (partialScoring, sessionValue, expected) => {
      it(`partial score ${partialScoring ? 'enabled' : ''}`, async () => {
        const result = await outcome({
            ...config,
            partialScoring
          },
          { value: sessionValue }
        );

        expect(result).toEqual(expected);
      });
    };

    assertOutcome(true, { 0: '1', 1: '0' }, { score: 1, empty: false });
    assertOutcome(true, { 0: '1', 1: '1' }, { score: 0.5, empty: false });
    assertOutcome(true, { 0: '5', 1: '10' }, { score: 1, empty: false });
    assertOutcome(true, { 0: '10', 1: '5' }, { score: 1, empty: false });
    assertOutcome(true, { 0: '7', 1: '7' }, { score: 0.5, empty: false });
    assertOutcome(true, { 0: '3', 1: '4' }, { score: 0, empty: false });
    assertOutcome(true, { 0: '2', 1: '3' }, { score: 0, empty: false });

    assertOutcome(false, { 0: '1', 1: '0' }, { score: 1, empty: false });
    assertOutcome(false, { 0: '1', 1: '1' }, { score: 0, empty: false });
    assertOutcome(false, { 0: '5', 1: '10' }, { score: 1, empty: false });
    assertOutcome(false, { 0: '10', 1: '5' }, { score: 1, empty: false });
    assertOutcome(false, { 0: '7', 1: '7' }, { score: 0, empty: false });
    assertOutcome(false, { 0: '3', 1: '4' }, { score: 0, empty: false });
    assertOutcome(false, { 0: '2', 1: '3' }, { score: 0, empty: false });

    it('returns expected outcome when session is undefined', async () => {
      expect(await outcome(question, undefined)).toEqual({ score: 0, empty: true });
    });

    it('returns expected outcome when session is null',  async () => {
      expect(await outcome(question, null)).toEqual({ score: 0, empty: true });
    });

    it('returns expected outcome when session is empty', async () => {
      expect(await outcome(question, {})).toEqual({ score: 0, empty: true });
    });
  });

  describe('correct response', () => {
    it('returns correct response if role is instructor and mode is gather', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'instructor'
      });

      expect(sess).toEqual({"id": "1", "value": {"0": "0", "1": "1"}});
    });

    it('returns correct response if role is instructor and mode is view', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'view',
        role: 'instructor'
      });

      expect(sess).toEqual({"id": "1", "value": {"0": "0", "1": "1"}});
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

  describe('get all correct responses', () => {
    const assertCorrectResponses = (configuration, expected) => {
      it('returns correct responses', () => {
        const responses = getAllCorrectResponses(configuration);

        expect(responses).toEqual(expected);
      });
    };

    assertCorrectResponses(config, {
      numberOfPossibleResponses: 8,
      possibleResponses: {
        '0': ['0', '1', '5', '10', '6', '9', '7', '8'],
        '1': ['1', '0', '10', '5', '9', '6', '8', '7']
      }
    });

    assertCorrectResponses({
      ...config,
      alternateResponses : [
        ['1', '5', '10', '6', '9', '7', '8'],
        ['0', '10', '5', '9', '6']
      ],
    }, {
      numberOfPossibleResponses: 6,
      possibleResponses: {
        '0': ['0', '1', '5', '10', '6', '9', '7', '8'],
        '1': ['1', '0', '10', '5', '9', '6']
      }
    });

    assertCorrectResponses({
      ...config,
      alternateResponses : [
        ['1', '5', '10', '6', '9'],
        ['0', '10', '5', '9', '6', '8', '7']
      ],
    }, {
      numberOfPossibleResponses: 6,
      possibleResponses: {
        '0': ['0', '1', '5', '10', '6', '9'],
        '1': ['1', '0', '10', '5', '9', '6', '8', '7']
      }
    });

    assertCorrectResponses({
      ...config,
      alternateResponses : [],
    }, {
      numberOfPossibleResponses: 1,
      possibleResponses: {
        '0': ['0'],
        '1': ['1']
      }
    });

    assertCorrectResponses({
      ...config,
      alternateResponses : null,
    }, {
      numberOfPossibleResponses: 1,
      possibleResponses: {
        '0': ['0'],
        '1': ['1']
      }
    });

    assertCorrectResponses({
      ...config,
      alternateResponses : undefined,
    }, {
      numberOfPossibleResponses: 1,
      possibleResponses: {
        '0': ['0'],
        '1': ['1']
      }
    });
  });

  describe('choice is empty', () => {
    const assertChoiceIsEmpty = (choice, expected) => {
      it(`${choice.value} is empty`, () => {
        expect(choiceIsEmpty(choice)).toEqual(expected);
      });
    };

    assertChoiceIsEmpty({ value: '' }, true);
    assertChoiceIsEmpty({ value: '    ' }, true);
    assertChoiceIsEmpty({ value: '<div></div>' }, true);
    assertChoiceIsEmpty({ value: '' +
        '' +
        '' }, true);
    assertChoiceIsEmpty({ value: '<div><div></div><span></span></div>' }, true);
    assertChoiceIsEmpty({ value: '<div><div></div>  <span></span></div>' }, true);
    assertChoiceIsEmpty({ value: '<div><div></div><span>.</span></div>' }, false);
    assertChoiceIsEmpty({ value: 'I<div><div></div><span></span></div>' }, false);
    assertChoiceIsEmpty({ value: 'Test' }, false);
  });
});
