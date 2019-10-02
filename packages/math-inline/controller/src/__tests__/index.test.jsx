import { model, outcome } from '../index';

const defaultModel = {
  responseType: 'Advanced Multi',
  equationEditor: '3',
  expression: '{{response}} = {{response}} \\text{eggs}',
  prompt:
    '<p>Sam sells baskets of eggs at his farm stand. He sold 12 baskets and wrote the number sentence below to show how many eggs he sold in all.</p><p><span class="equation-block"><math xmlns="http://www.w3.org/1998/Math/MathML" >\n <mrow>\n  <mn>12</mn><mo>&#x00D7;</mo><mo>&#x25A1;</mo><mo>=</mo><mn>72</mn>\n </mrow>\n</math> </span></p><p>What <span class="relative-emphasis">division</span> number sentence can be used to show how many eggs were in each basket?</p><p>Use the on-screen keyboard to type your number sentence and answer in the box.</p>',
  responses: [
    {
      id: '1',
      answer: '72\\div12=6\\text{eggs}',
      alternates: {
        '1': '6=72\\div12\\text{eggs}',
        '2': '\\frac{72}{12}=6\\text{eggs}',
        '3': '6=\\frac{72}{12}\\text{eggs}'
      },
      validation: 'literal'
    }
  ],
  customKeys: [
    '\\left(\\right)',
    '\\frac{}{}',
    'x\\frac{}{}'
  ],
  id: 1
};

const mkQuestion = model => model || defaultModel;

describe('model', () => {
  let result, question, session, env, outcomeResult;

  describe('gather', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = {};
      env = { mode: 'gather' };
      result = await model(question, session, env);
    });

    it('returns disabled:false', () => {
      expect(result.disabled).toEqual(false);
    });

    it('returns undefined for correctness ', () => {
      expect(result.correctness).toEqual(undefined);
    });

    it('returns empty object for correctResponse ', () => {
      expect(result.correctResponse).toEqual({});
    });

    it('returns undefined for feedback', () => {
      expect(result.feedback).toEqual(undefined);
    });
  });

  describe('view', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = {};
      env = { mode: 'view' };
      result = await model(question, session, env);
    });

    it('returns disabled:true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns undefined for correctness ', () => {
      expect(result.correctness).toEqual(undefined);
    });

    it('returns empty object for correctResponse ', () => {
      expect(result.correctResponse).toEqual({});
    });

    it('returns default correct for feedback', () => {
      expect(result.feedback).toEqual(undefined);
    });
  });

  describe('evaluate - empty', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = {};
      env = { mode: 'evaluate' };
      result = await model(question, session, env);
    });

    it('returns disabled:true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns empty for correctness ', () => {
      expect(result.correctness).toEqual({
        correct: false,
        correctness: 'unanswered',
        score: '0%'
      });
    });
  });

  describe('evaluate - correct', () => {
    beforeEach(async () => {
      env = { mode: 'evaluate' };
    });

    it('returns correct for correctness', async () => {
      question = mkQuestion();
      session = { completeAnswer: '72\\div12=6\\text{eggs}' };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = { completeAnswer: '6=72\\div12\\text{eggs}' };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = { completeAnswer: '\\frac{72}{12}=6\\text{eggs}' };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');
    });

    it('returns correct for correctness with text nodes too', async () => {
      question = mkQuestion();
      session = { completeAnswer: '72\\div12=6eggs' };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');
    });

    it('returns correct for correctness even with hyphen vs minus sign', async () => {
      question = mkQuestion({
        ...defaultModel,
        expression: '{{response}}',
        responses: [
          {
            id: '1',
            answer: '8-4',
            alternates: {
              '1': '4−2',
            },
            validation: 'literal'
          }
        ],
      });

      env = { mode: 'evaluate' };

      session = { completeAnswer: '4-2' };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = { completeAnswer: '4−2' };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = { completeAnswer: '8-4' };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = { completeAnswer: '8−4' };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

    });

    it('returns correct for correctness if allowSpaces is true', async () => {
      question = mkQuestion({
        ...defaultModel,
        responses: [
          {
            allowSpaces: true,
            answer: '\\frac{4}{15}\\ \\text{square}\\ \\text{inches}',
            id: '1',
            alternates: {},
            validation: 'literal'
          }
        ]
      });
      session = {
        completeAnswer: '\\frac{4}{15}\\ \\text{square}\\ \\text{inches}'
      };

      env = { mode: 'evaluate' };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');
    });

    it('returns correct for correctness if allowSpaces is true in simple mode too', async () => {
      question = mkQuestion({
        ...defaultModel,
        responseType: 'Simple',
        responses: [
          {
            allowSpaces: true,
            allowDecimals: true,
            answer: '3000',
            id: '1',
            alternates: {},
            validation: 'literal'
          }
        ]
      });
      session = {
        response: '3,000'
      };

      env = { mode: 'evaluate' };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');
    });
  });

  describe('evaluate - incorrect', () => {
    beforeEach(async () => {
      env = { mode: 'evaluate' };
    });

    it('returns incorrect for correctness', async () => {
      question = mkQuestion();
      session = { completeAnswer: '2\\div12=6\\text{eggs}' };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('incorrect');
      expect(result.correctness.score).toEqual('0%');

      session = { completeAnswer: '6=712\\div12\\text{eggs}' };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('incorrect');
      expect(result.correctness.score).toEqual('0%');

      session = { completeAnswer: '\\frac{752}{12}=6\\text{eggs}' };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('incorrect');
      expect(result.correctness.score).toEqual('0%');
    });
  });
});

describe('outcome', () => {
  let result;
  const question = mkQuestion();
  const env = { mode: 'evaluate' };

  it('returns correct for correctness in outcome', async () => {
    let session = { completeAnswer: '72\\div12=6\\text{eggs}' };
    let outcomeResult = await outcome(question, session, env);

    expect(outcomeResult.score).toEqual(1);

    session = { completeAnswer: '\\frac{72}{12}=6\\text{eggs}' };

    outcomeResult = await outcome(question, session, env);

    expect(outcomeResult.score).toEqual(1);
  });

  it('returns incorrect for correctness in outcome', async () => {
    let session = { completeAnswer: '2\\div12=6\\text{eggs}' };
    let outcomeResult = await outcome(question, session, env);

    expect(outcomeResult.score).toEqual(0);

    session = { completeAnswer: '\\frac{752}{12}=6\\text{eggs}' };

    result = await outcome(question, session, env);

    expect(outcomeResult.score).toEqual(0);
  });

  const returnOutcome = session => {
    it(`returns score: 0 and empty: true if session is ${JSON.stringify(session)}`, async () => {
      let outcomeResult = await outcome(question, session, env);

      expect(outcomeResult).toEqual({ score: 0, empty: true });
    });
  };

  returnOutcome(undefined);
  returnOutcome(null);
  returnOutcome({});
});
