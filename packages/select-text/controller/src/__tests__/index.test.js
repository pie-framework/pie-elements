import { getCorrectness, model, outcome } from '../index';
import isFunction from 'lodash/isFunction';

const token = (start, end, text, correct) => ({ start, end, text, correct });

describe('getCorrectness', () => {
  const assert = (tokens, selected, expected) => {
    //set tokens to be correct if not set
    tokens = tokens.map(
      t => (t.correct !== undefined ? t : { ...t, correct: true })
    );

    it(`${JSON.stringify(tokens)}, ${JSON.stringify(
      selected
    )} => ${JSON.stringify(expected)}`, () => {
      const c = getCorrectness(tokens, selected);
      expect(c).toEqual(expected);
    });
  };
  assert([token(0, 1, 'a')], [token(0, 1, 'a')], 'correct');
  assert(
    [token(0, 1, 'a'), token(1, 2, 'b', false)],
    [token(1, 2, 'b')],
    'incorrect'
  );
  assert([token(0, 1, 'a')], [], 'incorrect');
  assert([token(0, 1, 'a')], [token(1, 2, 'b')], 'incorrect');
  assert(
    [token(0, 1, 'a'), token(1, 2, 'b')],
    [token(0, 1, 'a')],
    'partially-correct'
  );
  assert(
    [token(0, 1, 'a'), token(1, 2, 'b')],
    [token(1, 2, 'b')],
    'partially-correct'
  );
});

const q = extras => ({
  highlightChoices: true,
  maxSelections: 10,
  tokens: [
    { start: 0, end: 1, text: 'f', correct: true },
    { start: 1, end: 2, text: 'o', correct: false },
    { start: 2, end: 3, text: 'o', correct: true }
  ],
  text: 'foo',
  ...extras
});

const s = extras => ({
  selectedTokens: [],
  ...extras
});

const e = extras => ({
  mode: 'gather',
  ...extras
});

const assertFn = fn => (label, question, session, env, expected) => {
  it(label, () =>
    fn(question, session, env).then(r => {
      if (isFunction(expected)) {
        expected(r);
      } else {
        expect(r).toMatchObject(expected);
      }
    })
  );
};

describe('outcome', () => {
  const assert = assertFn(outcome);

  assert('score undefined for gather', q(), s(), e(), { score: undefined });
  assert('score undefined for view', q(), s(), e({ mode: 'view' }), {
    score: undefined
  });
  assert(
    'score 1 for correct',
    q(),
    s({ selectedTokens: q().tokens.filter(t => t.correct) }),
    e({ mode: 'evaluate' }),
    {
      score: 1
    }
  );
  assert(
    'score 0 for partially-correct',
    q(),
    s({ selectedTokens: [q().tokens[0]] }),
    e({ mode: 'evaluate' }),
    {
      score: 0
    }
  );
  assert(
    'score 0.4 for partially-correct and partialScoring config',
    q({
      partialScoring: [{ numberOfCorrect: 1, scorePercentage: 40 }]
    }),
    s({ selectedTokens: [q().tokens[0]] }),
    e({ mode: 'evaluate' }),
    {
      score: 0.4
    }
  );
});

describe('model', () => {
  const assert = assertFn(model);

  describe('disabled', () => {
    assert('not disabled for gather', q(), s(), e(), {
      disabled: false
    });

    assert('disabled for evaluate', q(), s(), e({ mode: 'evaluate' }), {
      disabled: true
    });

    assert('disabled for view', q(), s(), e({ mode: 'view' }), {
      disabled: true
    });
  });

  describe('maxSelections', () => {
    assert('maxSelections is set', q(), s(), e(), {
      maxSelections: 10
    });
  });

  describe('highlightChoices', () => {
    assert('highlightChoices is set', q(), s(), e(), {
      highlightChoices: true
    });
  });

  describe('correctness', () => {
    assert('correctness undefined in gather', q(), s(), e(), {
      correctness: undefined,
      incorrect: undefined
    });

    assert('correctness undefined in view', q(), s(), e({ mode: 'view' }), {
      correctness: undefined,
      incorrect: undefined
    });
  });

  describe('feedback', () => {
    assert('feedback is undefined in gather', q(), s(), e(), {
      feedback: undefined
    });
    assert('feedback is undefined in view', q(), s(), e({ mode: 'view' }), {
      feedback: undefined
    });
    assert(
      'feedback is undefined in evaluate',
      q(),
      s(),
      e({ mode: 'evaluate' }),
      {
        feedback: 'Incorrect'
      }
    );
  });

  describe('tokens', () => {
    assert(
      'tokens.$.correct missing in gather',
      q(),
      s(),
      e({ mode: 'gather' }),
      r => {
        expect(r.tokens.filter(t => t.correct === undefined).length).toEqual(
          r.tokens.length
        );
      }
    );

    assert(
      'tokens.$.correct missing in view',
      q(),
      s(),
      e({ mode: 'view' }),
      r => {
        expect(r.tokens.filter(t => t.correct === undefined).length).toEqual(
          r.tokens.length
        );
      }
    );
    assert(
      'tokens.$.correct present in evaluate',
      q(),
      s(),
      e({ mode: 'evaluate' }),
      r => {
        expect(r.tokens.filter(t => t.correct === undefined).length).toEqual(0);
      }
    );
  });
});
