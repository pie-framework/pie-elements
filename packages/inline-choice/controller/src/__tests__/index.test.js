import { model, outcome, createCorrectResponseSession } from '../index';

describe('model', () => {
  let result;

  let question = {
    choices: [
      {
        value: 'a',
        label: 'a',
        correct: true,
        feedback: {
          type: 'custom',
          value: 'hooray'
        }
      },
      {
        value: 'b',
        label: 'b',
        correct: false,
        feedback: {
          type: 'default'
        }
      }
    ]
  };

  let session = {
    value: 'a'
  };

  let env;
  beforeEach(async () => {
    env = { mode: 'gather' };
    result = await model(question, session, env);
  });

  it('returns choices', () => {
    expect(result.choices).toMatchObject(
      question.choices.map(c => ({ label: c.label, value: c.value }))
    );
  });

  it('returns disabled:false', () => {
    expect(result.disabled).toEqual(false);
  });

  describe('mode == evaluate', () => {
    beforeEach(async () => {
      env = { mode: 'evaluate' };
      result = await model(question, session, env);
    });

    it('returns disabled: true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns result', () => {
      expect(result.result).toMatchObject({
        correct: true,
        feedback: 'hooray'
      });
    });

    const returnCorrectResult = (session) => {
      it(`returns result not correct if session is ${JSON.stringify(session)}`, async () => {
        const m = await model(question, session, { mode: 'evaluate' });

        expect(m.result).toEqual(expect.objectContaining({
          correct: false
        }));
      });
    };

    returnCorrectResult(undefined);
    returnCorrectResult(null);
    returnCorrectResult({});
  });

  describe('mode === evaluate nothing submitted', () => {
    beforeEach(async () => {
      env = { mode: 'evaluate' };
      session = {
        value: undefined
      };
      result = await model(question, session, env);
    });

    it('returns result', () => {
      expect(result.result).toMatchObject({
        correct: false,
        nothingSubmitted: true,
        feedback: undefined
      });
    });
  });

  describe('mode === evaluate wrong answer', () => {
    beforeEach(async () => {
      env = { mode: 'evaluate' };
      session = {
        value: 'b'
      };
      result = await model(question, session, env);
    });

    it('returns result', () => {
      expect(result.result).toMatchObject({
        correct: false,
        feedback: 'Incorrect'
      });
    });
  });
});

describe('outcome', () => {
  let question = {
    choices: [
      {
        value: 'a',
        label: 'a',
        correct: true,
        feedback: {
          type: 'custom',
          value: 'hooray'
        }
      },
      {
        value: 'b',
        label: 'b',
        correct: false,
        feedback: {
          type: 'default'
        }
      }
    ]
  };

  const returnOutcome = (session) => {
    it(`returns score: 0 and empty: true not correct if session is ${JSON.stringify(session)}`, async () => {
      const result = await outcome(question, session, { mode: 'evaluate' });

      expect(result).toEqual(expect.objectContaining({ score: 0, empty: true }));
    });
  };

  returnOutcome(undefined);
  returnOutcome(null);
  returnOutcome({});
});

describe('createCorrectResponseSession', () => {
  const question = {
    choices: [
      {
        value: 'sweden',
        label: 'Sweden'
      },
      {
        value: 'iceland',
        label: 'Iceland',
        feedback: {
          type: 'default'
        }
      },
      {
        correct: true,
        value: 'norway',
        label: 'Norway'
      },
      {
        value: 'finland',
        label: 'Finland',
        feedback: {
          type: 'custom',
          value: 'Nokia was founded in Finland.'
        }
      }
    ]
  };

  it('returns correct response if role is instructor and mode is gather', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'instructor'
    });

    expect(sess).toEqual({
      value: 'norway',
      id: '1'
    });
  });

  it('returns correct response if role is instructor and mode is view', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'view',
      role: 'instructor'
    });

    expect(sess).toEqual({
      value: 'norway',
      id: '1'
    });
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


