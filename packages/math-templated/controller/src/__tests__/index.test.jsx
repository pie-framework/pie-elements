import {
  getCorrectness,
  getPartialScore,
  outcome,
  createDefaultModel,
  normalizeSession,
  createCorrectResponseSession,
  getResponseCorrectness,
  validate,
  model,
} from '../index';

const question = {
  markup: '',
  responses: {
    1: { answer: '2', alternates: {} },
    2: { answer: '3', alternates: { 1: '4' } },
  },
};
const session = {
  answers: {
    r1: { value: '2' },
    r2: { value: '3' },
  },
};
const env = { mode: 'gather', role: 'instructor' };
const env2 = { mode: 'evaluate', role: 'instructor' };

describe('getResponseCorrectness', () => {
  it('should return "unanswered" when sessionResponse is null or undefined', () => {
    const question = { responses: {} };
    expect(getCorrectness(question, env2, null)).toEqual({
      correctness: 'unanswered',
      score: 0,
      correct: false,
    });
  });

    it('should return "correct" when all responses are correct', () => {
        const sessionResponse = {
            answers: {
                r1: {value: '2'},
                r2: {value: '3'}
            }
        };
        expect(getCorrectness(question, env2, sessionResponse)).toEqual({
            correctness: 'correct',
            score: 1,
            correct: true,
        });
    });

  it('should return "incorrect" with partial score when some responses are correct', () => {
        const sessionResponse = {
            answers: {
                r1: {value: '2'},
                r2: {value: '8'}
            }
        };
        expect(getCorrectness(question, env2, sessionResponse)).toEqual({
            correctness: 'incorrect',
            score: 0.5,
            correct: false,
        });
    });

  it('should return "incorrect" with score 0 when all responses are incorrect', () => {
    const sessionResponse = {
      answers: {
        r1: { value: '1' },
        r2: { value: '10' },
      },
    };
    expect(getCorrectness(question, env2, sessionResponse)).toEqual({
      correctness: 'incorrect',
      score: 0,
      correct: false,
    });
  });

  it('should return "unanswered" for an empty session response', () => {
    const sessionResponse = {};
    expect(getCorrectness(question, env2, sessionResponse)).toEqual({
      correctness: 'unanswered',
      score: 0,
      correct: false,
    });
  });
});

describe('getPartialScore', () => {
  it('should return 0 when session is empty', () => {
    const result = getPartialScore(question, {});
    expect(result).toBe(0);
  });
});

describe('outcome', () => {
  const assertOutcome = (partialScoring, sessionValue, expected) => {
    it(`partial score ${partialScoring ? 'enabled' : ''}`, async () => {
      const result = await outcome(
        {
          ...question,
          partialScoring,
        },
        { ...sessionValue },
        env2,
      );
      expect(result).toEqual(expected);
    });
  };

    assertOutcome(true, { answers: { r1: { value: '2' }, r2: { value: '3' }}}, { score: 1 });
    // correct alternate
    assertOutcome(true, { answers: { r1: { value: '2' }, r2: { value: '4' }}}, { score: 1 });
    // partial scoring
    assertOutcome(true, { answers: { r1: { value: '2' }, r2: { value: '5' }}}, { score: 0.5 });
    assertOutcome(true, { answers: { r1: { value: '3' }, r2: { value: '5' }}}, { score: 0 });
    // partial correct but no score as partial scoring is disabled
    assertOutcome(false, { answers: { r1: { value: '2' }, r2: { value: '5' }}}, { score: 0 });
});

describe('createDefaultModel', () => {
  it('should create a default model with updated responses', () => {
    const result = createDefaultModel({ responses: question.responses });
    expect(result.responses).toEqual(
      expect.objectContaining({
        1: expect.objectContaining({
          allowTrailingZeros: undefined,
          alternates: {},
          answer: '2',
          ignoreOrder: undefined,
          validation: undefined,
        }),
        2: expect.objectContaining({
          allowTrailingZeros: undefined,
          alternates: { 1: '4' },
          answer: '3',
          ignoreOrder: undefined,
          validation: undefined,
        }),
      }),
    );
  });
});

describe('normalizeSession', () => {
  it('should return a normalized session object', () => {
    const result = normalizeSession(session);
    expect(result).toEqual(session);
  });
});

describe('createCorrectResponseSession', () => {
  it('should resolve with correct responses when mode is not "evaluate"', async () => {
    const result = await createCorrectResponseSession(question, env);
    expect(result).toEqual({
      id: '1',
      answers: {
        r1: { value: '2' },
        r2: { value: '3' },
      },
    });
  });

  it('should resolve with null when mode is "evaluate"', async () => {
    const question = {
      responses: {
        1: { answer: 'a' },
        2: { answer: 'b' },
      },
    };
    const result = await createCorrectResponseSession(question, env2);
    expect(result).toBeNull();
  });

  it('should resolve with correct responses even if question has no responses', async () => {
    const question = {
      responses: {},
    };
    const result = await createCorrectResponseSession(question, env);
    expect(result).toEqual({
      id: '1',
      answers: {},
    });
  });
});

describe('validate', () => {
  it('should validate the model and return validation errors', () => {
    const result = validate(question);
    expect(result).toEqual(
      expect.objectContaining({ responseAreas: 'There should be at least 1 response area defined.' }),
    );
  });
});
