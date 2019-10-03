import { model, getScore, outcome, prepareVal } from '../index';

const choice = (l, v) => ({ label: l, value: v });
const choices = {
  0: [choice('cow', '0'), choice('cattle', '1'), choice('calf', '2')],
  1: [choice('over', '0'), choice('past', '1'), choice('beyond', '2')],
  2: [choice('moon', '0')]
};

describe('model', () => {
  let question;

  beforeEach(() => {
    question = {
      choices,
      prompt: 'Use the dropdowns to complete the sentence',
      markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>'
    };
  });

  it('output when session is defined', async () => {
    const m = await model(question,
      { value: { 0: 'cow', 1: 'over', 2: 'moon' } },
      { mode: 'evaluate' }
    );

    expect(m).toEqual(expect.objectContaining({
      feedback: {0: "correct", 1: "correct", 2: "correct"},
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
        feedback: {0: "incorrect", 1: "incorrect", 2: "incorrect"},
        responseCorrect: false
      }))
    });
  };

  returnModel(undefined);
  returnModel(null);
  returnModel({});
});

describe('getScore', () => {
  let question;

  beforeEach(() => {
    question = {
      choices,
      prompt: 'Use the dropdowns to complete the sentence',
      markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>'
    };
  });

  it('score = 1 when session is defined', () => {
    expect(getScore(question, { value: { 0: 'cow', 1: 'over', 2: 'moon' } })).toEqual(1)
  });

  const returnScore = (session) => {
    it(`score = 0 when session is ${JSON.stringify(session)}`,  () => {
      expect(getScore(question, session)).toEqual(0);
    });
  };

  returnScore(undefined);
  returnScore(null);
  returnScore({});
});

describe('outcome', () => {
  let question;

  beforeEach(() => {
    question = {
      choices,
      prompt: 'Use the dropdowns to complete the sentence',
      markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>'
    };
  });

  it('empty: false when session is defined', async () => {
    const m = await outcome(question, { value: { 0: 'cow', 1: 'over', 2: 'moon' } });

    expect(m).toEqual(expect.objectContaining({ score: 1, empty: false }))
  });

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

});
