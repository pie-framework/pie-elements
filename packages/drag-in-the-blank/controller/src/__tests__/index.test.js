import isFunction, { model, getScore, outcome, createCorrectResponseSession } from '../index';

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

  xdescribe('model', () => {
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

  describe('get score', () => {
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

  xdescribe('outcome', () => {
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

  xdescribe('correct response', () => {
    it('returns correct response if env is correct', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'instructor'
      });
      expect(sess).toEqual({"id": "1", "value": {"0": "0", "1": "1"}});
    });

    it('returns null env is student', async () => {
      const noResult = await createCorrectResponseSession(question, { mode: 'gather', role: 'student' });
      expect(noResult).toBeNull();
    });
  });

});
