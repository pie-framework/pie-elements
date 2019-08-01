import { model, outcome } from '../index';
import defaultValues from '../defaults';

describe('model', () => {
  let result, question, session, env;

  const defaultModel = {
    ...defaultValues,
    id: 1
  };

  const mkQuestion = model => model || defaultModel;

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
  });

  describe('evaluate - incorrect', () => {
    beforeEach(async () => {
      env = { mode: 'evaluate' };
    });

    it('returns correct for correctness', async () => {
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

describe('outcome - support', () => {
  it.only('??', async () => {
    const model = {
      equationEditor: 'geometry',
      responses: [
        {
          alternates: {
            '1': '170-4x'
          },
          answer: 'y=-4x+170',
          validation: 'literal',
          id: '1',
          allowSpaces: true
        }
      ],
      id: '4028e4a247efbc8d01480984cb002b97',
      element: 'math-inline',
      question:
        '<p>The interior angles of a triangle have measures of <math xmlns="http://www.w3.org/1998/Math/MathML"> <mrow> <msup> <mrow> <mo stretchy="false">(</mo><mi>x</mi><mo>+</mo><mi>y</mi><mo stretchy="false">)</mo></mrow> <mo>°</mo> </msup> </mrow> </math> , <math xmlns="http://www.w3.org/1998/Math/MathML"> <mrow> <msup> <mrow> <mo stretchy="false">(</mo><mn>2</mn><mi>x</mi><mo stretchy="false">)</mo></mrow> <mo>°</mo> </msup> </mrow> </math> , and <math xmlns="http://www.w3.org/1998/Math/MathML"> <mrow> <msup> <mrow> <mo stretchy="false">(</mo><mi>x</mi><mo>+</mo><mn>10</mn><mo stretchy="false">)</mo></mrow> <mo>°</mo> </msup> </mrow> </math> .</p><p>What is the value of <math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>y</mi> </math> in terms of <math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>x</mi> </math> ?&nbsp;</p><p>Use the on-screen keyboard to type the correct equation in the box.&nbsp;</p>',
      responseType: 'Advanced Multi',
      expression: '{{response}}',
      rationale:
        '<p>The sum of the measures of the interior angles of any triangle is 180°. Given this property, it must be that (<span class="variable">x</span> + <span class="variable">y</span>) + (2<span class="variable">x</span>) + (<span class="variable">x</span> + 10) = 180. Simplifying, this is equivalent to 4<span class="variable">x</span> + <span class="variable">y</span> + 10 = 180 or <span class="variable">y</span> = 170&nbsp;– 4<span class="variable">x</span>.&nbsp;</p>'
    };
    const session = {
      id: '4028e4a247efbc8d01480984cb002b97',
      answers: {
        r1: {
          value: '170-4x'
        }
      },
      completeAnswer: '170-4x'
    };
    const env = { mode: 'evaluate' };
    const result = await outcome(model, session, env);
    expect(result).toEqual({ score: 1 });
  });
});
