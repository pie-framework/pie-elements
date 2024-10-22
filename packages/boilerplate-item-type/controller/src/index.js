import isEmpty from 'lodash/isEmpty';
import defaults from './defaults';

export const getCorrectness = (model) => {
  const correctnessCondition = 'c';

  switch (correctnessCondition) {
    case 'c':
      return 'correct';
    case 'pc':
      return 'partially-correct';
    case 'i':
      return 'incorrect';
    default:
      return 'unknown';
  }
};

export const getPartialScore = (question, session) => {
  if (!session || isEmpty(session)) {
    return 0;
  }

  return 1;
};

export const outcome = (question, session, env) =>
  new Promise((resolve) => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    session = normalizeSession(session);

    if (env.mode !== 'evaluate') {
      resolve({ score: undefined, completed: undefined });
    } else {
      resolve({ score: 1 });
    }
  });

export const createDefaultModel = (model = {}) => ({ ...defaults.model, ...model });

export const normalizeSession = (s) => ({ ...s });

export const model = (question, session, env) => {
  return new Promise((resolve) => {
    session = session || {};
    const normalizedQuestion = createDefaultModel(question);

    const out = {
      prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
      env,
    };

    resolve(out);
  });
};

export const createCorrectResponseSession = (question, env) => {
  return new Promise((resolve) => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      resolve({ id: '1' });
    } else {
      resolve(null);
    }
  });
};

export const validate = (model = {}, config = {}) => {
  const errors = {};

  return errors;
};
