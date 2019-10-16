import { model, outcome, getCorrectness, createCorrectResponseSession } from '../index';

const mkQuestion = () => ({
  correctResponses: {
    values: ['a']
  },
  feedback: {
    correct: {
      type: 'default'
    },
    partial: {
      type: 'custom',
      custom: 'foo'
    },
    incorrect: {
      type: 'custom',
      custom: 'foo'
    }
  },
  partialResponses: {
    values: ['aa']
  }
});

describe('model', () => {
  let result, question, session, env;

  describe('gather', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { value: 'a' };
      env = { mode: 'gather' };
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
      session = { value: 'a' };
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
      session = { value: 'a' };
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

  describe('correct response', () => {
    it('returns correct response if env is correct', async () => {
      const sess = await createCorrectResponseSession(question, {
        mode: 'gather',
        role: 'instructor'
      });
      expect(sess).toEqual({"id": "1", "value": "a" });
    });

    it('returns null env is student', async () => {
      const noResult = await createCorrectResponseSession(question, { mode: 'gather', role: 'student' });
      expect(noResult).toBeNull();
    });
  });

  describe('evaluate - partially correct', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { value: 'aa' };
      env = { mode: 'evaluate' };
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

describe('outcome', () => {
  const assertOutcome = session => {
    it(`returns score: 0, empty: true if session is ${JSON.stringify(session)}`, async () => {
      const o = await outcome(mkQuestion(), session, { mode: 'evaluate' });
      expect(o).toEqual({ score: 0, empty: true });
    });
  };

  assertOutcome(undefined);
  assertOutcome(null);
  assertOutcome({});
});

describe('getCorrectness', () => {
  const assertCorrectness = session => {
    it(`returns score: 0, empty: true if session is ${JSON.stringify(session)}`, () => {
      const o = getCorrectness(mkQuestion(), session, { mode: 'evaluate' });
      expect(o).toEqual('empty');
    });
  };

  assertCorrectness(undefined);
  assertCorrectness(null);
  assertCorrectness({});
});
