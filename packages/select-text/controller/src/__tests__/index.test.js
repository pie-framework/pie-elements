import {
  getPartialScore,
  getCorrectness,
  model,
  outcome,
  createCorrectResponseSession,
} from '../index';
import isFunction from 'lodash/isFunction';

jest.mock('@pie-lib/text-select', () => ({
  prepareText: jest.fn()
}));

const token = (start, end, text, correct) => ({ start, end, text, correct });

describe('getCorrectness', () => {
  const assert = (tokens, selected, expected) => {
    //set tokens to be correct if not set
    tokens = tokens.map((t) =>
      t.correct !== undefined ? t : { ...t, correct: true }
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

  describe('with markup', () => {
    const markupArrayToTokens = (arr, correctIndicies) => {
      const text = arr.join(' ');

      return arr.map((s, index) => {
        const start = text.indexOf(s);
        const end = start + s.length;
        const correct = correctIndicies.indexOf(index) >= 0;
        return token(start, end, null, correct);
      });
    };

    it('returns partially correct', () => {
      const markup = ['<div>hi</div>', '<div>there</div>', '<div>?</div>'];
      const tokens = markupArrayToTokens(markup, [0, 2]);

      const result = getCorrectness(tokens, [tokens[0]]);
      expect(result).toEqual('partially-correct');
    });

    it('returns correct', () => {
      const markup = ['<div>hi</div>', '<div>there</div>', '<div>?</div>'];
      const tokens = markupArrayToTokens(markup, [0, 2]);

      const result = getCorrectness(tokens, [tokens[0], tokens[2]]);
      expect(result).toEqual('correct');
    });

    it('returns incorrect', () => {
      const markup = ['<div>hi</div>', '<div>there</div>', '<div>?</div>'];
      const tokens = markupArrayToTokens(markup, [0, 2]);

      const result = getCorrectness(tokens, [tokens[1]]);
      expect(result).toEqual('incorrect');
    });
  });
});

const q = (extras) => ({
  feedbackEnabled: true,
  highlightChoices: true,
  maxSelections: 10,
  tokens: [
    { start: 0, end: 1, text: 'f', correct: true },
    { start: 1, end: 2, text: 'o', correct: false },
    { start: 2, end: 3, text: 'o', correct: true },
  ],
  text: 'foo',
  ...extras,
});

const s = (extras) => ({
  selectedTokens: [],
  ...extras,
});

const e = (extras) => ({
  mode: 'gather',
  ...extras,
});

const assertFn = (fn) => (label, question, session, env, expected) => {
  it(label, () =>
    fn(question, session, env).then((r) => {
      if (isFunction(expected)) {
        expected(r);
      } else {
        expect(r).toMatchObject(expected);
      }
    })
  );
};

describe('correct response', () => {
  it('returns correct response if env is correct', async () => {
    const sess = await createCorrectResponseSession(q(), {
      mode: 'gather',
      role: 'instructor',
    });
    expect(sess).toEqual({
      id: '1',
      selectedTokens: [
        { correct: true, end: 1, start: 0, text: 'f' },
        { correct: true, end: 3, start: 2, text: 'o' },
      ],
    });
  });

  it('returns null env is student', async () => {
    const noResult = await createCorrectResponseSession(q(), {
      mode: 'gather',
      role: 'student',
    });
    expect(noResult).toBeNull();
  });
});

describe('outcome', () => {
  it('handles empty session', async () => {
    const result = await outcome(
      { tokens: [] },
      { id: '1' },
      { mode: 'evaluate' }
    );
    console.log('result:', result);
    expect(result).toEqual({ score: 0 });
  });

  const assert = assertFn(outcome);

  assert(
    'score: 0 and empty: true if session is undefined',
    q(),
    undefined,
    e(),
    { score: 0, empty: true }
  );
  assert('score: 0 and empty: true if session is null', q(), null, e(), {
    score: 0,
    empty: true,
  });
  assert('score: 0 and empty: true if session is {}', q(), {}, e(), {
    score: 0,
    empty: true,
  });

  assert('score undefined for gather', q(), s(), e(), { score: undefined });
  assert('score undefined for view', q(), s(), e({ mode: 'view' }), {
    score: undefined,
  });
  assert(
    'score 1 for correct',
    q(),
    s({ selectedTokens: q().tokens.filter((t) => t.correct) }),
    e({ mode: 'evaluate' }),
    {
      score: 1,
    }
  );
  assert(
    'score 0.5 when partialScoring is not defined (on by default)',
    q({ partialScoring: undefined }),
    s({ selectedTokens: [q().tokens[0]] }),
    e({ mode: 'evaluate' }),
    {
      score: 0.5,
    }
  );
  assert(
    'score 0 for partially-correct',
    q({ partialScoring: false }),
    s({ selectedTokens: [q().tokens[0]] }),
    e({ mode: 'evaluate' }),
    {
      score: 0,
    }
  );
  assert(
    'score 0.50 for partially-correct and partialScoring config',
    q({
      partialScoring: true,
    }),
    s({ selectedTokens: [q().tokens[0]] }),
    e({ mode: 'evaluate' }),
    {
      score: 0.5,
    }
  );
  assert(
    'score 0 for partially-correct and partialScoring config with deduction',
    q({
      partialScoring: true,
    }),
    s({ selectedTokens: [...q().tokens, { start: 3, end: 4, text: '0' }] }),
    e({ mode: 'evaluate' }),
    {
      score: 0,
    }
  );
  assert(
    'score 0.50 for partially-correct and partialScoring config with deduction',
    q({
      partialScoring: true,
    }),
    s({ selectedTokens: q().tokens }),
    e({ mode: 'evaluate' }),
    {
      score: 0.5,
    }
  );
});

describe('model', () => {
  const assert = assertFn(model);

  describe('disabled', () => {
    assert('not disabled for gather', q(), s(), e(), {
      disabled: false,
    });

    assert('disabled for evaluate', q(), s(), e({ mode: 'evaluate' }), {
      disabled: true,
    });

    assert('disabled for view', q(), s(), e({ mode: 'view' }), {
      disabled: true,
    });
  });

  describe('maxSelections', () => {
    assert('maxSelections is set', q(), s(), e(), {
      maxSelections: 10,
    });
  });

  describe('highlightChoices', () => {
    assert('highlightChoices is set', q(), s(), e(), {
      highlightChoices: true,
    });
  });

  describe('correctness', () => {
    assert('correctness undefined in gather', q(), s(), e(), {
      correctness: undefined,
      incorrect: undefined,
    });

    assert('correctness undefined in view', q(), s(), e({ mode: 'view' }), {
      correctness: undefined,
      incorrect: undefined,
    });

    assert(
      'correctness undefined in view',
      q(),
      undefined,
      e({ mode: 'evaluate' }),
      {
        correctness: 'incorrect',
      }
    );

    assert(
      'correctness undefined in view',
      q(),
      null,
      e({ mode: 'evaluate' }),
      {
        correctness: 'incorrect',
      }
    );

    assert('correctness undefined in view', q(), {}, e({ mode: 'evaluate' }), {
      correctness: 'incorrect',
    });
  });

  describe('feedback', () => {
    assert('feedback is undefined in gather', q(), s(), e(), {
      feedback: undefined,
    });
    assert('feedback is undefined in view', q(), s(), e({ mode: 'view' }), {
      feedback: undefined,
    });
    assert(
      'feedback is defined in evaluate',
      q(),
      s(),
      e({ mode: 'evaluate' }),
      {
        feedback: 'Incorrect',
      }
    );
    assert(
      'correct feedback is defined in evaluate',
      q(),
      s({
        selectedTokens: [
          { start: 0, end: 1, text: 'f', correct: true },
          { start: 2, end: 3, text: 'o', correct: true },
        ],
      }),
      e({ mode: 'evaluate' }),
      {
        feedback: 'Correct',
      }
    );
  });

  describe('tokens', () => {
    assert(
      'tokens.$.correct missing in gather',
      q(),
      s(),
      e({ mode: 'gather' }),
      (r) => {
        expect(r.tokens.filter((t) => t.correct === undefined).length).toEqual(
          r.tokens.length
        );
      }
    );

    assert(
      'tokens.$.correct missing in view',
      q(),
      s(),
      e({ mode: 'view' }),
      (r) => {
        expect(r.tokens.filter((t) => t.correct === undefined).length).toEqual(
          r.tokens.length
        );
      }
    );
    assert(
      'tokens.$.correct present in evaluate',
      q(),
      s(),
      e({ mode: 'evaluate' }),
      (r) => {
        expect(r.tokens.filter((t) => t.correct === undefined).length).toEqual(
          0
        );
      }
    );
  });

  describe('edge cases', () => {
    it(' is ok if missing fields', async () => {
      const d = {
        element: 'select-text-element',
        highlightChoices: true,
        maxSelections: 0,
        prompt:
          '<p>\n  <strong>Hazle “clic” en la oración que mejor describe la idea principal del pasaje.</strong>\n</p>\n<p>\n  &nbsp;\n</p>',
        scoringType: 'auto',
        teacherInstructions: true,
        studentInstructions: false,
        partialScoring: false,
        text:
          '<span>Estaba muy enojado.</span><span>-Pedro,¿cómo pudiste hacer eso?</span><span>¡No debes usar cosas ajenas sin preguntar primero!</span><span>De pronto me sentí terrible.</span><span>¡Estaba acusando a mi hermano de hacer la misma cosa que yo había hecho!</span><span>Mi mamá me miró de una forma muy extraña.</span><span>Ella podía ver que yo sabía lo que había hecho.</span>',
        id: '2414982',
        mode: 'sentence',
        feedback: {
          correct: {
            default: 'Correct',
            type: 'none',
          },
          incorrect: {
            default: 'Incorrect',
            type: 'none',
          },
        },
        tokens: [
          {
            start: 0,
            correct: false,
            end: 32,
            text: '<span>Estaba muy enojado.</span>',
          },
          {
            end: 90,
            text: '<span>-Pedro,¿cómo pudiste hacer eso?</span>',
            start: 32,
            correct: false,
          },
          {
            start: 90,
            correct: true,
            end: 159,
            text:
              '<span>¡No debes usar cosas ajenas sin preguntar primero!</span>',
          },
          {
            start: 159,
            correct: false,
            end: 207,
            text: '<span>De pronto me sentí terrible.</span>',
          },
          {
            text:
              '<span>¡Estaba acusando a mi hermano de hacer la misma cosa que yo había hecho!</span>',
            start: 207,
            correct: false,
            end: 305,
          },
          {
            start: 305,
            correct: false,
            end: 380,
            text: '<span>Mi mamá me miró de una forma muy extraña.</span>',
          },
          {
            start: 380,
            correct: false,
            end: 461,
            text:
              '<span>Ella podía ver que yo sabía lo que había hecho.</span>',
          },
        ],
      };

      const result = await model(d, {}, { mode: 'evaluate' });
      expect(result).toBeDefined();
    });
  });

  describe("partialScoring", () => {
    const model = {
      tokens: [
        {
          text: "Benedict",
          start: 0,
          end: 8,
          correct: false,
        },
        {
          text: "Arnold",
          start: 9,
          end: 15,
          correct: false,
        },
        {
          text: "is",
          start: 16,
          end: 18,
          correct: false,
        },
        {
          text: "remembered",
          start: 19,
          end: 29,
          correct: false,
        },
        {
          text: "for",
          start: 30,
          end: 33,
          correct: false,
        },
        {
          text: "betraying",
          start: 34,
          end: 43,
          correct: true,
        },
        {
          text: "the",
          start: 44,
          end: 47,
          correct: false,
        },
        {
          text: "American",
          start: 48,
          end: 56,
          correct: false,
        },
        {
          text: "patriots",
          start: 57,
          end: 65,
          correct: true,
        },
        {
          text: "during",
          start: 66,
          end: 72,
          correct: false,
        },
        {
          text: "the",
          start: 73,
          end: 76,
          correct: false,
        },
        {
          text: "Revolutionary",
          start: 77,
          end: 90,
          correct: true,
        },
        {
          text: "War.",
          start: 91,
          end: 95,
          correct: true,
        }
      ],
      highlightChoices: false,
      text: "Benedict Arnold is remembered for betraying the American patriots during the Revolutionary War.",
      disabled: false,
      rationale: null,
      partialScoring: true
    };

    it('returns a score of 0', async () => {
      const result = await outcome(model, {
        id: 1,
        selectedTokens: [{
          text: 'the',
          start: 73,
          end: 76,
          correct: false,
        }]
      }, {mode: 'evaluate'});
      expect(result.score).toEqual(0);
    });

    it('returns a score of 1', async () => {
      const result = await outcome(model, {
        id: 1,
        selectedTokens: [{
            text: 'Revolutionary',
            start: 77,
            end: 90,
            correct: true,
          },
          {
            text: 'War.',
            start: 91,
            end: 95,
            correct: true,
          },
          {
            text: "patriots",
            start: 57,
            end: 65,
            correct: true,
          },
          {
            text: "betraying",
            start: 34,
            end: 43,
            correct: true,
          }]
      }, {mode: 'evaluate'});
      expect(result.score).toEqual(1);
    });

    it('returns a score of 0.75', async () => {
      const result = await outcome(model, {
        id: 1,
        selectedTokens: [{
          text: 'Revolutionary',
          start: 77,
          end: 90,
          correct: true,
        },
        {
          text: 'patriots',
          start: 57,
          end: 65,
          correct: true,
        },
        {
          text: 'betraying',
          start: 34,
          end: 43,
          correct: true,
        }]
      }, {mode: 'evaluate'});
      expect(result.score).toEqual(0.75);
    });

    it('returns a score of 0.5', async () => {
      const result = await outcome(model, {
        id: 1,
        selectedTokens: [{
          text: "during",
          start: 66,
          end: 72,
          correct: false,
        },
        {
          text: "the",
          start: 73,
          end: 76,
          correct: false,
        },
        {
          text: 'Revolutionary',
          start: 77,
          end: 90,
          correct: true,
        },
        {
          text: 'betraying',
          start: 34,
          end: 43,
          correct: true,
        }]
      }, {mode: 'evaluate'});
      expect(result.score).toEqual(0.5);
    });

    it('returns a score of 0.25', async () => {
      const result = await outcome(model, {
        id: 1,
        selectedTokens: [{
          text: 'Revolutionary',
          start: 77,
          end: 90,
          correct: true,
        },
        {
          text: "during",
          start: 66,
          end: 72,
          correct: false,
        },
        {
          text: "the",
          start: 73,
          end: 76,
          correct: false,
        }]
      }, {mode: 'evaluate'});
      expect(result.score).toEqual(0.25);
    });

    it('returns a score of 0 for 1/4 correct answer an 4 incorrect answers', async () => {
      const result = await outcome(model, {
        id: 1,
        selectedTokens: [{
          text: 'Revolutionary',
          start: 77,
          end: 90,
          correct: true,
        },
        {
          text: "during",
          start: 66,
          end: 72,
          correct: false,
        },
        {
          text: "the",
          start: 73,
          end: 76,
          correct: false,
        },
        {
          text: 'is',
          start: 16,
          end: 18,
          correct: false,
        },
        {
          text: 'remembered',
          start: 19,
          end: 29,
          correct: false,
        },
        {
          text: 'for',
          start: 30,
          end: 33,
          correct: false,
        }]
      }, {mode: 'evaluate'});
      expect(result.score).toEqual(0);
    });
  });
});
