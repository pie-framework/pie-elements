import { getScore, outcome, createCorrectResponseSession } from '../index';

const question = {
  prompt: 'Which of these northern European countries are EU members?',
  choiceMode: 'checkbox',
  choicePrefix: 'numbers',
  choices: {
    0: [
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
    ]
  }
};

describe('outcome', () => {
  const returnOutcome = session => {
    it(`return score: 0 and empty: true if session is ${JSON.stringify(session)}`, async () => {
      const out = await outcome(question, session);
      expect(out).toEqual({ score: 0, empty: true });
    });
  };

  returnOutcome(undefined);
  returnOutcome(null);
  returnOutcome({});
});

describe('getScore', () => {
  const returnScore = session => {
    it(`return score: 0 if session is ${JSON.stringify(session)}`, () => {
      expect(getScore(question, session)).toEqual(0);
    });
  };

  returnScore(undefined);
  returnScore(null);
  returnScore({});
});

describe('createCorrectResponseSession', () => {
  const question = {
    prompt: 'Use the dropdowns to complete the sentence',
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
    },
    alternateResponse: {
      '2': ['2', '3']
    }
  };

  it('returns correct response if role is instructor and mode is gather', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'instructor'
    });

    expect(sess).toEqual({
      value: {
        '0': '0',
        '1': '0',
        '2': '0'
      },
      id: '1'
    });
  });

  it('returns correct response if role is instructor and mode is view', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'view',
      role: 'instructor'
    });

    expect(sess).toEqual({
      value: {
        '0': '0',
        '1': '0',
        '2': '0'
      },
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
