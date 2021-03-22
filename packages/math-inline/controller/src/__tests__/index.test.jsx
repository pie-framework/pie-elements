import { model, outcome, createCorrectResponseSession } from '../index';

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
  customKeys: ['\\left(\\right)', '\\frac{}{}', 'x\\frac{}{}'],
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

    it('returns undefined for correctResponse ', () => {
      expect(result.correctResponse).toEqual(undefined);
    });

    it('returns undefined for feedback', () => {
      expect(result.feedback).toEqual(undefined);
    });

    it('returns empty array for responses', () => {
      expect(result.config.responses).toEqual([]);
    });

    it('returns null for rationale', () => {
      expect(result.config.rationale).toEqual(null);
    });

    it('returns null for teacher instructions', () => {
      expect(result.config.teacherInstructions).toEqual(null);
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

    it('returns undefined for correctResponse ', () => {
      expect(result.correctResponse).toEqual(undefined);
    });

    it('returns default correct for feedback', () => {
      expect(result.feedback).toEqual(undefined);
    });

    it('returns empty array for responses', () => {
      expect(result.config.responses).toEqual([]);
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
      session = { completeAnswer: '72\\div12=6\\text{eggs}' };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');
    });

    it('returns correct for correctness with text nodes too in symbolic', async () => {
      question = mkQuestion();
      session = { completeAnswer: '72\\div12=6\\text{eggs}' };
      question.responses[0].validation = 'symbolic';
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
              '1': '4−2'
            },
            validation: 'literal'
          }
        ]
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

    it('returns correct for correctness in cdot vs times situations', async () => {
      question = mkQuestion({
        ...defaultModel,
        expression: '{{response}}',
        responses: [
          {
            id: '1',
            answer: '8\\cdot4',
            alternates: {
              '1': '4\\times2'
            },
            validation: 'literal'
          }
        ]
      });

      env = { mode: 'evaluate' };

      session = { completeAnswer: '8\\times4' };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = { completeAnswer: '4\\cdot2' };

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
            allowThousandsSeparator: true,
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

    describe('all responses are checked', () => {
      beforeEach(() => {
        question = mkQuestion({
          ...defaultModel,
          responses: [
            {
              answer: '0.5+3.5',
              validation: 'symbolic',
              alternates: ['2']
            },
            { answer: 'foo', validation: 'literal', allowSpaces: true, id: '1' }
          ]
        });
      });

      it('4 is correct - symbolic match answer', async () => {
        result = await model(question, { completeAnswer: '4' }, env);
        expect(result.correctness.correctness).toEqual('correct');
      });

      it('3 is incorrect - no match', async () => {
        result = await model(question, { completeAnswer: '3' }, env);
        expect(result.correctness.correctness).toEqual('incorrect');
      });

      it('2 is correct - symbolic match responses[0].alternates[0]', async () => {
        result = await model(question, { completeAnswer: '2' }, env);
        expect(result.correctness.correctness).toEqual('correct');
      });

      it('foo is correct - literal match response[1]', async () => {
        result = await model(question, { completeAnswer: 'foo' }, env);
        expect(result.correctness.correctness).toEqual('correct');
      });
    });

    it('works for incorrect latex frac command too', async () => {
      question = mkQuestion({
        ...defaultModel,
        responseType: 'Advanced Multi',
        expression: '{{response}}',
        responses: [
          {
            alternates: {},
            answer: '1\\frac14',
            validation: 'symbolic',
            id: '1',
            allowSpaces: true
          }
        ]
      });
      session = {
        completeAnswer: '1\\frac{1}{4}'
      };

      env = { mode: 'evaluate' };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = {
        completeAnswer: '1\\frac1{4}'
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');
    });
  });

  it('works for literal validation for incomplete latex command too', async () => {
    question = mkQuestion({
      ...defaultModel,
      responseType: 'Advanced Multi',
      expression: '{{response}}',
      responses: [
        {
          alternates: { 1: 'p\\left(x\\right)' },
          answer: '1\\frac14',
          validation: 'literal',
          id: '1',
          allowSpaces: true
        }
      ]
    });
    session = {
      completeAnswer: '1\\frac{1}{4}'
    };

    env = { mode: 'evaluate' };
    result = await model(question, session, env);

    expect(result.correctness.correctness).toEqual('correct');
    expect(result.correctness.score).toEqual('100%');

    session = {
      completeAnswer: '1\\frac1{4}'
    };

    result = await model(question, session, env);

    expect(result.correctness.correctness).toEqual('correct');
    expect(result.correctness.score).toEqual('100%');

    session = {
      completeAnswer: 'p(x)'
    };

    env = { mode: 'evaluate' };
    result = await model(question, session, env);

    expect(result.correctness.correctness).toEqual('correct');
    expect(result.correctness.score).toEqual('100%');

    session = {
      completeAnswer: 'p\\left(x\\right)'
    };

    env = { mode: 'evaluate' };
    result = await model(question, session, env);

    expect(result.correctness.correctness).toEqual('correct');
    expect(result.correctness.score).toEqual('100%');
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
    it(`returns score: 0 and empty: true if session is ${JSON.stringify(
      session
    )}`, async () => {
      let outcomeResult = await outcome(question, session, env);

      expect(outcomeResult).toEqual({ score: 0, empty: true });
    });
  };

  returnOutcome(undefined);
  returnOutcome(null);
  returnOutcome({});
});

describe('createCorrectResponseSession', () => {
  const answer = '72\\div12=6';
  const question = {
    id: '1',
    responseType: 'Advanced Multi',
    expression: '{{response}} = {{response}}',
    prompt:
      '<p>Sam sells baskets of eggs at his farm stand. He sold 12 baskets and wrote the number sentence below to show how many eggs he sold in all.</p><p><span class="equation-block"><math xmlns="http://www.w3.org/1998/Math/MathML" >\n <mrow>\n  <mn>12</mn><mo>&#x00D7;</mo><mo>&#x25A1;</mo><mo>=</mo><mn>72</mn>\n </mrow>\n</math> </span></p><p>What <span class="relative-emphasis">division</span> number sentence can be used to show how many eggs were in each basket?</p><p>Use the on-screen keyboard to type your number sentence and answer in the box.</p>',
    responses: [
      {
        id: '1',
        answer,
        alternates: {
          '1': '6=72\\div12]',
          '2': '\\frac{72}{12}=6',
          '3': '6=\\frac{72}{12}'
        },
        validation: 'literal'
      }
    ],
    customKeys: ['\\left(\\right)', '\\frac{}{}', 'x\\frac{}{}']
  };

  describe('7165', () => {
    it('returns whole answer', async () => {
      const question = {
        element: 'math-inline',
        responseType: 'Advanced Multi',
        expression: '{{response}}',
        responses: [
          {
            alternates: {},
            answer: '2\\times7',
            validation: 'literal',
            id: '1',
            allowSpaces: true
          }
        ],
        id: '1'
      };

      const ca = question.responses[0].answer;
      const cs = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'instructor'
      });
      expect(cs).toMatchObject({
        id: '1',
        completeAnswer: ca,
        answers: { r1: { value: ca } }
      });
    });
  });

  describe('PD-173', () => {
    it('returns empty answer if model is incorrectly defined', async () => {
      const question = {
        element: 'math-inline',
        responseType: 'Advanced Multi',
        expression: 'x={{response}}\\ \\text{radians}',
        responses: [
          {
            alternates: {},
            answer: "x=\\frac{20,000}{r^2}\\text{radians}",
            validation: 'symbolic',
            id: '1',
            allowSpaces: true
          }
        ],
        id: '1'
      };

      const ca = question.responses[0].answer;
      const cs = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'instructor'
      });

      expect(cs).toMatchObject({
        id: '1',
        completeAnswer: ca,
        answers: { }
      });
    });
  });

  const val = value => ({ value });
  describe.each`
    expression                                      | cr                                | expected
    ${'{{  response}}'}                             | ${'1'}                            | ${{ r1: val('1') }}
    ${'{{response}} = {{response}}'}                | ${'1 = 1'}                        | ${{ r1: val('1'), r2: val('1') }}
    ${'{{response}} + {{response}} = {{response}}'} | ${'1 + 2 = 3'}                    | ${{ r1: val('1'), r2: val('2'), r3: val('3') }}
    ${'{{response}} = {{response}}'}                | ${'\\frac{2}{3} + 2 = \\sqrt{9}'} | ${{ r1: val('\\frac{2}{3} + 2'), r2: val('\\sqrt{9}') }}
    ${'{{response}} = {{response}}'}                | ${'72\\div12=6'}                  | ${{ r1: val('72\\div12'), r2: val('6') }}
    ${'{{response}} = {{response}}'}                | ${'72\\div12  =  6'}              | ${{ r1: val('72\\div12'), r2: val('6') }}
    ${'{{response}} = {{response}} / {{response}}'} | ${'72\\div12  =  6/2'}            | ${{ r1: val('72\\div12'), r2: val('6'), r3: val('2') }}
  `('$expression + $cr', ({ expression, cr, expected }) => {
    let crs;
    let env;
    let q;
    beforeEach(async () => {
      try {
        env = { mode: 'gather', role: 'instructor' };
        q = {
          expression,
          responses: [{ answer: cr }]
        };
        crs = await createCorrectResponseSession(q, env);
      } catch (e) {
        console.error(e);
        fail(e);
      }
    });

    it(`${JSON.stringify(expected)} correct answers`, () => {
      expect(crs.answers).toEqual(expected);
    });
    it(`${JSON.stringify(expected)} - no 'response' prop`, () => {
      expect(crs.response).not.toBeDefined();
    });
  });

  it.each`
    mode        | role
    ${'gather'} | ${'instructor'}
    ${'view'}   | ${'instructor'}
  `('returns correctResponse for $mode + $role', async ({ mode, role }) => {
    const sess = await createCorrectResponseSession(question, { mode, role });

    expect(sess).toMatchObject({
      answers: {
        r1: val('72\\div12'),
        r2: val('6')
      },
      completeAnswer: answer,
      id: '1'
    });
  });

  it('returns correct response if role is instructor and mode is view and responseType is Simple', async () => {
    const sess = await createCorrectResponseSession(
      {
        ...question,
        expression: '{{response}}',
        responses: [
          { answer: '\\frac{3}{4}', validation: 'symbolic', id: '1' }
        ],
        responseType: 'Simple'
      },
      {
        mode: 'view',
        role: 'instructor'
      }
    );

    expect(sess).toMatchObject({
      response: '\\frac{3}{4}',
      completeAnswer: '\\frac{3}{4}',
      id: '1'
    });
  });

  it('returns null if mode is evaluate', async () => {
    const noResult = await createCorrectResponseSession(question, {
      mode: 'evaluate',
      role: 'instructor'
    });

    expect(noResult).toBeNull();
  });

  it('returns null if role is student', async () => {
    const noResult = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'student'
    });

    expect(noResult).toBeNull();
  });

  describe('PIE-188', () => {
    it('works', async () => {
      const question = {
        responseType: 'Advanced Multi',
        expression: '{{response}}',
        equationEditor: 'miscellaneous',
        responses: [
          {
            alternates: {},
            answer: '1530',
            validation: 'symbolic',
            id: '1',
            allowSpaces: true
          }
        ],
        id: '1',
        element: 'math-inline',
        customKeys: [
          '<',
          '\\le',
          '\\ge',
          '>',
          '\\frac{}{}',
          'x^{}',
          '\\left(\\right)'
        ]
      };
      const session = {
        id: '1',
        answers: {
          r1: {
            value: '\\odot'
          }
        },
        completeAnswer: '\\odot'
      };
      const env = { mode: 'evaluate' };

      try {
        await model(question, session, env);
      } catch (e) {
        console.error('>>');
        console.log(e);
        fail(e);
      }
      await expect(model(question, session, env)).resolves.toMatchObject({
        correctness: { correct: false }
      });
    });
  });
});

describe('6456 - outcome', () => {
  const question = {
    equationEditor: 8,
    responseType: 'Advanced Multi',
    teacherInstructions: '',
    expression: '{{response}}',
    responses: [
      {
        allowSpaces: true,
        answer: '-12.5',
        id: '1',
        alternates: { '1': '-12.5\\%' },
        validation: 'symbolic'
      }
    ],
    id: '1',
    prompt: 'prompt',
    rationale: 'rationale',
    element: 'math-inline'
  };

  it('scores 0', async () => {
    const session = {
      id: '1',
      answers: { r1: { value: '-12\\%' } },
      completeAnswer: '-12\\%'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(question, session, env);
    expect(result).toEqual({ score: 0 });
  });

  it('scores 1', async () => {
    const session = {
      id: '1',
      answers: { r1: { value: '-12.5\\%' } },
      completeAnswer: '-12.5\\%'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(question, session, env);
    expect(result).toEqual({ score: 1 });
  });
});

describe('6371', () => {
  const question = {
    equationEditor: 8,
    responseType: 'Advanced Multi',
    teacherInstructions: '',
    expression: '{{response}}\\ \\text{dollars}',
    responses: [
      {
        allowSpaces: true,
        answer: '4\\times10^3\\ \\text{dollars}',
        id: '1',
        alternates: {},
        validation: 'symbolic'
      }
    ],
    id: '1',
    prompt: 'prompt',
    rationale: 'rationale',
    element: 'math-inline'
  };

  it('scores 1', async () => {
    const session = {
      id: '1',
      answers: { r1: { value: '4000\\ \\text{dollars}' } },
      completeAnswer: '4000\\ \\text{dollars}'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(question, session, env);
    expect(result).toEqual({ score: 1 });
  });
});

describe('3826', () => {
  const question = {
    equationEditor: 8,
    responseType: 'Advanced Multi',
    teacherInstructions: '',
    expression: '{{response}}\\ \\text{%}',
    responses: [
      {
        id: '1',
        answer: '84%',
        alternates: {},
        validation: 'literal',
        allowSpaces: true
      }
    ],
    id: '1',
    prompt: 'prompt',
    rationale: 'rationale',
    element: 'math-inline'
  };

  it('scores 1', async () => {
    const session = {
      id: '1',
      answers: { r1: { value: '84\\ \\text{%}' } },
      completeAnswer: '84\\ \\text{%}'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(question, session, env);
    expect(result).toEqual({ score: 1 });
  });
});


describe('PD-66', () => {
  const question = {
    id: '1',
    prompt: 'prompt',
    rationale: 'rationale',
    element: 'math-inline',
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    responseType: 'Advanced Multi',
    expression: '{{response}}',
    equationEditor: 'statistics',
    responses: [
      {
        allowSpaces: true,
        answer: '\\left(-\\frac{x}{3},-\\frac{y}{3}\\right)',
        id: '1',
        validation: 'literal',
      },
      {
        answer: '\\left(\\frac{-x}{3},\\frac{-y}{3}\\right)',
        validation: 'equivLiteral',
      },
      {
        answer: '\\left(\\frac{x}{-3},\\frac{y}{-3}\\right)',
        validation: 'equivLiteral',
      },
      {
        answer: '\\left(-\\frac{1}{3}x,-\\frac{1}{3}y\\right)',
        validation: 'equivLiteral',
      },
      {
        answer: '\\left(\\frac{-1}{3}x,\\frac{-1}{3}y\\right)',
        validation: 'equivLiteral',
      },
      {
        answer: '\\left(\\frac{1}{-3}x,\\frac{1}{-3}y\\right)',
        validation: 'equivLiteral',
      },
    ],
  };

  it('scores 1', async () => {
    const session = {
      id: '1',
      answers: { r1: { value: '\\left(-\\frac{x}{3},-\\frac{y}{3}\\right)' } },
      completeAnswer: '\\left(-\\frac{x}{3},-\\frac{y}{3}\\right)'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(question, session, env);
    expect(result).toEqual({ score: 1 });
  });
});

describe('PD-205', () => {
  const question = {
    id: 1,
    element: 'math-inline',
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    equationEditor: 3,
    teacherInstructions: '',
    responseType: 'Advanced Multi',
    expression:
        '{{response}}\\ =\\ {{response}}\\ \\text{cubic}\\ \\text{inches}',
    rationale:
        '<p>The volume of the box can be solved by any equivalent variation of the equation: 10 &#215; 7 &#215; 5 = 350 (cubic&#160;inches)&#160;or 70 &#215; 5 = 350&#160;(cubic&#160;inches). This answer is the result of accurately applying either the formula <span class="variable">l</span> &#215; <span class="variable">w</span> &#215; <span class="variable">h</span> = <span class="variable">V</span> or <span class="variable">b</span> &#215; <span class="variable">h</span> = <span class="variable">V</span> to find the volume of the&#160;rectangular prism described.</p>',
    prompt:
        '<p>Elyse has a plastic box she uses for sand art designs, as shown below.</p><p><img alt="image 5afe5c90cd7e491896d58552ab74b6f7" id="5afe5c90cd7e491896d58552ab74b6f7" src="https://storage.googleapis.com/pie-prod-221718-assets/image/a3ee5289-d882-4c7d-abce-2ee70ce8c26f"></p><p>The length of the box is 10&#160;inches, the width is 7&#160;inches, and the height is 5&#160;inches. Write and solve an&#160;equation Elyse can use to find&#160;the volume of sand, in cubic inches, that will fit in the container.&#160;</p><p>Use the on-screen keyboard to type the correct equation and answer in the box.</p>',
    responses: [
      {
        answer: '10\\times7\\times5=350\\ \\text{cubic}\\text{inches}',
        validation: 'literal',
        id: '1',
        allowSpaces: true,
      },
      {
        validation: 'equivLiteral',
        answer: '350=10\\times7\\times5\\ \\text{cubic}\\text{inches}',
      },
      {
        answer: '350=10\\times5\\times7\\ \\text{cubic}\\text{inches}',
        validation: 'equivLiteral',
      },
      {
        answer: '350=7\\times5\\times10\\ \\text{cubic}\\text{inches}',
        validation: 'equivLiteral',
      },
      {
        answer: '350=5\\times10\\times7\\ \\text{cubic}\\text{inches}',
        validation: 'equivLiteral',
      },
      {
        validation: 'equivLiteral',
        answer: '350=7\\times10\\times5\\ \\text{cubic}\\text{inches}',
      },
      {
        answer: '350=7\\times5\\times10\\ \\text{cubic}\\text{inches}',
        validation: 'equivLiteral',
      },
      {
        answer: '70\\times5=350\\ \\text{cubic}\\text{inches}',
        validation: 'equivLiteral',
      },
      {
        answer: '350=70\\times5\\ \\text{cubic}\\text{inches}',
        validation: 'equivLiteral',
      },
      {
        answer: '350=5\\times70\\ \\text{cubic}\\text{inches}',
        validation: 'equivLiteral',
      },
    ],
  };

  it('scores 1', async () => {
    const session = {
      id: '1',
      answers: { r1: { value: '350' }, r2: { value: '7\\cdot50'} },
      completeAnswer: '350\\ =\\ 7\\cdot50\\ \\text{cubic}\\ \\text{inches}'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(question, session, env);
    expect(result).toEqual({ score: 1 });
  });
});

describe('PD-610', () => {
  const equation_01 = {
    id: 1,
    element: 'math-inline',
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    equationEditor: 3,
    teacherInstructions: '',
    responseType: 'Advanced Multi',
    expression:
    "\\frac{1}{3}=\\frac{{response}}{6}",
    rationale:
        '<p>A correct response is shown below:</p><ul><li>1/3 = <strong>2</strong>/6</li><li>3/4 = <strong>6</strong>/8</li><li>3/6 = <strong>1</strong>/2</li></ul>',
    responses: [
      {
        answer: '\\frac{1}{3}=\\frac{2}{6}',
        validation: 'literal',
        id: '1',
        allowSpaces: true,
      }
    ],
  };

  it('scores 1', async () => {
    const session = {
      id: '1',
      answers: { r1: { value: '2' } },
      completeAnswer: '\\frac{1}{3}=\\frac{2}{6}'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(equation_01, session, env);
    expect(result).toEqual({ score: 1 });
  });


  it('scores 0', async () => {
    const session = {
      id: '1',
      answers: { r1: { value: '2' } },
      completeAnswer: '\\frac{1}{3}=\\frac{1}{6}'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(equation_01, session, env);
    expect(result).toEqual({ score: 0 });
  });

  const equation_02 = {
    id: 2,
    element: 'math-inline',
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    equationEditor: 3,
    teacherInstructions: '',
    responseType: 'Advanced Multi',
    expression:
    "\\frac{3}{4}=\\frac{{response}}{8}",
    rationale:
        '<p>A correct response is shown below:</p><ul><li>1/3 = <strong>2</strong>/6</li><li>3/4 = <strong>6</strong>/8</li><li>3/6 = <strong>1</strong>/2</li></ul>',
    responses: [
      {
        answer: '\\frac{3}{4}=\\frac{6}{8}',
        validation: 'literal',
        id: '1',
        allowSpaces: true,
      }
    ],
  };

  it('scores 1', async () => {
    const session = {
      id: '2',
      answers: { r1: { value: '6' } },
      completeAnswer: '\\frac{3}{4}=\\frac{6}{8}'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(equation_02, session, env);
    expect(result).toEqual({ score: 1 });
  });


  it('scores 0', async () => {
    const session = {
      id: '2',
      answers: { r1: { value: '6' } },
      completeAnswer: '\\frac{3}{4}=\\frac{3}{8}'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(equation_02, session, env);
    expect(result).toEqual({ score: 0});
  });

  const equation_03 = {
    id: 3,
    element: 'math-inline',
    feedbackEnabled: true,
    promptEnabled: true,
    rationaleEnabled: true,
    teacherInstructionsEnabled: true,
    studentInstructionsEnabled: true,
    equationEditor: 3,
    teacherInstructions: '',
    responseType: 'Advanced Multi',
    expression:
    "\\frac{3}{6}=\\frac{{response}}{2}",
    rationale:
        '<p>A correct response is shown below:</p><ul><li>1/3 = <strong>2</strong>/6</li><li>3/4 = <strong>6</strong>/8</li><li>3/6 = <strong>1</strong>/2</li></ul>',
    responses: [
      {
        answer: '\\frac{3}{6}=\\frac{1}{2}',
        validation: 'literal',
        id: '3',
        allowSpaces: true,
      }
    ],
  };

  it('scores 1', async () => {
    const session = {
      id: '3',
      answers: { r1: { value: '1' } },
      completeAnswer: '\\frac{3}{6}=\\frac{1}{2}'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(equation_03, session, env);
    expect(result).toEqual({ score: 1 });
  });

  it('scores 0', async () => {
    const session = {
      id: '3',
      answers: { r1: { value: '1' } },
      completeAnswer: '\\frac{3}{6}=\\frac{2}{2}'
    };

    const env = { mode: 'evaluate' };
    const result = await outcome(equation_03, session, env);
    expect(result).toEqual({ score: 0 });
  });
});
