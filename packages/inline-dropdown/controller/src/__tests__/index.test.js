import { getScore, outcome } from '../index';

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
  }};

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