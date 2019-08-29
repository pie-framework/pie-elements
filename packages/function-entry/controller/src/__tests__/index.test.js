import { model, outcome } from '../index';

const mkQuestion = () => ({
  equation: '3x+2',
  feedback: {
    correct: {
      type: 'default'
    },
    incorrect: {
      type: 'custom',
      custom: 'foo'
    }
  }
});

describe('model', () => {
  let result, question, session, env;

  describe('gather', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { value: '3x+2' };
      env = { mode: 'gather' };
      result = await model(question, session, env);
    });

    it('returns disabled:false', () => {
      expect(result.disabled).toEqual(false);
    });

    it('returns undefined for correctness ', () => {
      expect(result.correctness).toEqual(undefined);
    });

    it('returns undefined for feedback', () => {
      expect(result.feedback).toEqual(undefined);
    });
  });

  describe('view', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { value: '3x+2' };
      env = { mode: 'view' };
      result = await model(question, session, env);
    });

    it('returns disabled:true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns undefined for correctness ', () => {
      expect(result.correctness).toEqual(undefined);
    });

    it('returns default correct for feedback', () => {
      expect(result.feedback).toEqual(undefined);
    });
  });

  describe('evaluate - correct', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { value: '3x+2' };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);
    });

    it('returns disabled:true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns correct for correctness ', () => {
      expect(result.correctness).toEqual('correct');
    });

    it('returns default correct for feedback', () => {
      expect(result.feedback).toEqual('Correct');
    });
  });

  describe('evaluate - incorrect', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { value: '3x+3' };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);
    });

    it('returns disabled:true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns incorrect for incorrectness ', () => {
      expect(result.correctness).toEqual('incorrect');
    });

    it('returns custom incorrect for feedback', () => {
      expect(result.feedback).toEqual('foo');
    });
  });

  describe('evaluate - correctness with mathjs', () => {
    it('returns (in)correct for mathematically (in)correct answer too', async () => {
      question = mkQuestion();
      session = { value: '3x+2+1-1+x-x' };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);

      expect(result.correctness).toEqual('correct');

      session = { value: '3+3x+2-3' };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);

      expect(result.correctness).toEqual('correct');

      session = { value: '3+3x+2-3+x' };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);

      expect(result.correctness).toEqual('incorrect');
    });
  });

  describe('evaluate - session not defined', () => {
    const question = mkQuestion();
    const env = { mode: 'evaluate' };

    const returnsOutput = session => {
      it(`empty when session is ${JSON.stringify(session)}`, async () => {
        const m = await model(question, session, env);
        expect(m.correctness).toEqual('empty');
      });
    };

    returnsOutput(undefined);
    returnsOutput(null);
    returnsOutput({});
  });
});

describe('outcome', () => {
  const question = mkQuestion();
  const env = { mode: 'evaluate' };

  const returnsOutput = session => {
    it(`score: 0 when session is ${JSON.stringify(session)}`, async () => {
      const m = await outcome(question, session, env);
      expect(m).toEqual({ score: 0, empty: true });
    });
  };

  returnsOutput(undefined);
  returnsOutput(null);
  returnsOutput({});

  it('score: 1 when session is defined', async () => {
    const m = await outcome(question, { value: '3+3x+2-3' }, env);
    expect(m).toEqual({ score: 1 });
  });

});

