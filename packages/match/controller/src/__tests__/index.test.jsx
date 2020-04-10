import { model, outcome, createCorrectResponseSession } from '../index';
import { defaults as feedbackDefaults } from '@pie-lib/feedback';

jest.mock('@pie-lib/controller-utils', () => ({
  getShuffledChoices: (choices, session, updateSession, key) => {
    const currentShuffled = ((session || {}).shuffledValues || []).filter(v => v);

    if (session && !currentShuffled.length && updateSession && typeof updateSession === 'function') {
      updateSession();
    }

    return choices;
  },
  partialScoring: {
    enabled: (config, env) => {
      config = config || {};
      env = env || {};

      if (config.partialScoring === false) {
        return false;
      }

      if (env.partialScoring === false) {
        return false;
      }

      return true;
    }
  }
}));

const defaultModel = {
  id: '1',
  element: 'match-element',
  rows: [{
    id: 1,
    title: 'Question Text 1',
    values: [false, false]
  }, {
    id: 2,
    title: 'Question Text 2',
    values: [false, false]
  }, {
    id: 3,
    title: 'Question Text 3',
    values: [false, false]
  }, {
    id: 4,
    title: 'Question Text 4',
    values: [false, false]
  }],
  lockChoiceOrder: true,
  partialScoring: false,
  feedbackEnabled: true,
  layout: 3,
  headers: ['Column 1', 'Column 2', 'Column 3'],
  choiceMode: 'checkbox',
  feedback: {
    correct: {
      type: 'none',
      default: 'Correct'
    },
    partial: {
      type: 'none',
      default: 'Nearly'
    },
    incorrect: {
      type: 'none',
      default: 'Incorrect'
    }
  },
};

describe('outcome', () => {
  const returnCorrectness = sess => {
    it(`returns empty: true and score: 0 if session is ${JSON.stringify(sess)}`, async () => {
      const result = await outcome(defaultModel, sess, { mode: 'evaluate' });
      expect(result).toEqual({ score: 0, empty: true });
    });
  };

  returnCorrectness(undefined);
  returnCorrectness(null);
  returnCorrectness({});
});

describe('outcome partialScoring test', () => {
  const assertOutcome = (message, extra, sessionValue, env, expected) => {
    it(message, async () => {
      const result = await outcome({
          ...defaultModel,
          ...extra
        },
        sessionValue,
        env
      );

      expect(result).toEqual(expect.objectContaining(expected));
    });
  };

  assertOutcome('element.partialScoring = true',
    { partialScoring: true }, { answers: { 1: [false, false] } }, { mode: 'evaluate' }, { score: 0.25 });

  assertOutcome('element.partialScoring = false',
    { partialScoring: false }, { answers: { 1: [false, false] } }, { mode: 'evaluate' }, { score: 0 });

  assertOutcome('element.partialScoring = false, env.partialScoring = true',
    { partialScoring: false }, { answers: { 1: [false, false] } }, { mode: 'evaluate', partialScoring: true }, { score: 0 });

  assertOutcome('element.partialScoring = true, env.partialScoring = false',
    { partialScoring: true }, { answers: { 1: [false, false] } }, { mode: 'evaluate', partialScoring: false }, { score: 0 });
});

describe('model', () => {
  let result, question, session, env;

  const mkQuestion = model => model || defaultModel;

  describe('gather', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = {};
      env = { mode: 'gather' };
      result = await model(question, session, env);
    });

    it('returns a new object, without using the same reference', () => {
      expect(result).not.toEqual(question);
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

    it('returns rows without correct values', () => {
      expect(result.config.rows).toEqual(defaultModel.rows.map(({ id, title}) => ({ id, title })));
    });

  });

  describe('view', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = {};
      env = { mode: 'view' };
      result = await model(question, session, env);
    });

    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        session = { id: '1', element: 'match-element' };
        env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model(
          {
            ...question,
            lockChoiceOrder: false
          },
          session,
          env,
          updateSession
        );
        expect(updateSession).toHaveBeenCalled();
      });
    });

    it('returns a new object, without using the same reference', () => {
      expect(result).not.toEqual(question);
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

    it('returns rows without correct values', () => {
      expect(result.config.rows).toEqual(defaultModel.rows.map(({ id, title}) => ({ id, title })));
    });
  });

  describe('evaluate - empty', () => {
    beforeEach(async () => {
      question = mkQuestion();
      session = { answers: {} };
      env = { mode: 'evaluate' };
      result = await model(question, session, env);
    });

    it('returns a new object, without using the same reference', () => {
      expect(result).not.toEqual(question);
    });

    it('returns disabled:true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns empty for correctness', () => {
      expect(result.correctness).toEqual({
        correctness: 'unanswered',
        score: '0%'
      });
    });

    it('returns empty for correctness with empty session', async () => {
      session = { answers: {} };
      result = await model(question, session, env);
      expect(result.correctness).toEqual({
        correctness: 'unanswered',
        score: '0%'
      });
    });

    it('returns default for feedback', async () => {
      expect(result.feedback).toEqual(feedbackDefaults.unanswered.default);
    });

    it('returns rows with correct values', () => {
      expect(result.config.rows).toEqual(defaultModel.rows);
    });

    const returnCorrectness = sess => {
      it(`returns unanswered for correctness and 0 for score if session is ${JSON.stringify(sess)}`, async () => {
        result = await model(question, sess, env);
        expect(result.correctness).toEqual({
          correctness: 'unanswered',
          score: '0%'
        });
      });
    };

    returnCorrectness(undefined);
    returnCorrectness(null);
    returnCorrectness({});
  });

  describe('evaluate - partially correct', () => {
    beforeEach(async () => {
      env = { mode: 'evaluate' };
    });

    it('does not return partially-correct for correctness when partial scores are not allowed', async () => {
      question = mkQuestion({
        ...defaultModel,
        partialScoring: false,
      });

      session = {
        answers: {
          1: [false, false],
          2: [false, false],
          3: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('incorrect');
      expect(result.correctness.score).toEqual('0%');
    });

    it('does not return partially-correct for correctness when partial scores are allowed for radios', async () => {
      question = mkQuestion({
        ...defaultModel,
        choiceMode: 'radio',
      });

      session = {
        answers: {
          1: [true, false],
          2: [true, false],
          3: [true, false],
          4: [true, false],
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('incorrect');
      expect(result.correctness.score).toEqual('0%');
    });

    it('returns partially-correct for checkbox correctness', async () => {
      question = mkQuestion({
        ...defaultModel,
        partialScoring: true,
      });

      session = {
        answers: {
          1: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('25%');

      session = {
        answers: {
          2: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('25%');

      session = {
        answers: {
          1: [false, false],
          2: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');

      session = {
        answers: {
          2: [false, false],
          4: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');

      session = {
        answers: {
          2: [false, false],
          3: [false, false],
          4: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('75%');

      session = {
        answers: {
          1: [false, false],
          3: [false, false],
          4: [false, true]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('63%');

      session = {
        answers: {
          1: [true, false],
          3: [true, false],
          4: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('50%');
    });

    it('returns partially-correct for radio correctness', async () => {
      question = mkQuestion({
        ...defaultModel,
        rows: [{
          id: 1,
          title: 'Question Text 1',
          values: [true, false, false]
        }, {
          id: 2,
          title: 'Question Text 2',
          values: [false, false, true]
        }, {
          id: 3,
          title: 'Question Text 3',
          values: [true, false, false]
        }],
        choiceMode: 'radio',
        partialScoring: true
      });

      session = {
        answers: {
          1: [true, false, false],
          2: [false, true, false],
          3: [false, true, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('33%');

      session = {
        answers: {
          1: [true, false, false],
          2: [false, false, true],
          3: [false, true, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('partial');
      expect(result.correctness.score).toEqual('67%');
    });

    it('returns correct for correctness when partial correctness is enabled', async () => {
      question = mkQuestion({
        ...defaultModel,
        partialScoring: true,

      });

      session = {
        answers: {
          1: [false, false],
          2: [false, false],
          3: [false, false],
          4: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = {
        answers: {
          2: [false, false],
          3: [false, false],
          1: [false, false],
          4: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = {
        answers: {
          4: [false, false],
          2: [false, false],
          3: [false, false],
          1: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');
    });
  });

  describe('evaluate - correct', () => {
    beforeEach(async () => {
      env = { mode: 'evaluate' };
    });

    it('returns correct for correctness when partial correctness is not enabled', async () => {
      question = mkQuestion({
        ...defaultModel,
        partialScoring: false,
      });

      session = {
        answers: {
          1: [false, false],
          2: [false, false],
          3: [false, false],
          4: [false, false]
        }
      };

      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

      session = {
        answers: {
          1: [false, false],
          4: [false, false],
          2: [false, false],
          3: [false, false]
        }
      };
      result = await model(question, session, env);

      expect(result.correctness.correctness).toEqual('correct');
      expect(result.correctness.score).toEqual('100%');

    });
  });

  describe('correct response', () => {
    it('returns correct response if env is correct', async () => {
      const sess = await createCorrectResponseSession(defaultModel, { mode: 'gather', role: 'instructor' });
      expect(sess).toEqual({
        answers: {
          '1': [false, false],
          '2': [false, false],
          '3': [false, false],
          '4': [false, false]
        },
        id: '1'
      });
    });

    it('returns null env is student', async () => {
      const noResult = await createCorrectResponseSession(defaultModel, { mode: 'gather', role: 'student' });
      expect(noResult).toBeNull();
    });
  });
});
