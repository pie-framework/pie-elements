import { model } from '../index';


describe('model', () => {


  let result, question, session, env;

  const mkQuestion = () => ({
    correctResponses: {
      values: ['a'],
      feedback: {
        type: 'default'
      }
    },
    partialResponses: {
      values: ['aa'],
      feedback: {
        type: 'custom',
        value: 'foo'
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
      session = { value: 'a' }
      env = { mode: 'gather' }
      result = await model(question, session, env);
    });

    it('returns color_contrast', () => {
      expect(result.colorContrast).toEqual('black_on_white');
    });
    it('returns undefined for numbers only warning', () => {
      expect(result.numbersOnlyWarning).toEqual(undefined);
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
      session = { value: 'a' }
      env = { mode: 'view' }
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
      session = { value: 'a' }
      env = { mode: 'evaluate' }
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

  describe('evaluate - partially correct', () => {

    beforeEach(async () => {
      question = mkQuestion();
      session = { value: 'aa' }
      env = { mode: 'evaluate' }
      result = await model(question, session, env);
    });

    it('returns disabled:true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns partially-correct for correctness ', () => {
      expect(result.correctness).toEqual('partially-correct');
    });

    it('returns custom correct for feedback', () => {
      expect(result.feedback).toEqual('foo');
    });

  });
});