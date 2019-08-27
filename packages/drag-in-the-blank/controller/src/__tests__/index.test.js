import { model, getScore, outcome } from '../index';

const choice = (v, id) => ({ value: v, id });
const question = {
  prompt: '<p>Solve the equation below.</p>',
  shuffle: true,
  choices: [
    choice('<div>6</div>', '0'),
    choice('<div>9</div>', '1')
  ],
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


describe('model', () => {
  it('returns expected model when session is undefined', async () => {
    const m = await model(question, undefined, { mode: 'evaluate' });

    expect(m).toEqual(expect.objectContaining({
      ...question,
      responseCorrect: false,
    }));
  });

  it('returns expected model when session is null', async () => {
    const m = await model(question, null, { mode: 'evaluate' });

    expect(m).toEqual(expect.objectContaining({
      ...question,
      responseCorrect: false,
    }));
  });

  it('returns expected model when session is empty', async () => {
    const m = await model(question, {}, { mode: 'evaluate' });

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

describe('outcome', () => {
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