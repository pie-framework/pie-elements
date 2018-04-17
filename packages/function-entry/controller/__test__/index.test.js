import { model } from '../src/index';

describe('model', () => {
  let result, question, session, env;

  const mkQuestion = () => ({
    correctResponse: {
      equation: '3x+2',
      feedback: {
        type: 'default'
      }
    },
    incorrectFeedback: {
      type: 'custom',
      value: 'foo'
    }
  });

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
  })
});
