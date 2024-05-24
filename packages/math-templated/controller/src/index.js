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

export const createDefaultModel = (model = {}) => ({
  ...defaults.model,
  ...model,
});
export const normalizeSession = (s) => ({
  ...s,
});

export const model = (question, session, env) => {
  return new Promise((resolve) => {
    session = session || {};
    const normalizedQuestion = createDefaultModel(question);

    const out = {
      prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
      markup: normalizedQuestion.markup,
      responses: env.mode ==='gather' ? null : normalizedQuestion.responses,
      language: normalizedQuestion.language,
      // todo I don't know how this is supposed to work
      // note: '',
      env,

      equationEditor: normalizedQuestion.equationEditor,
      customKeys: normalizedQuestion.customKeys,
      disabled: env.mode !== 'gather',
      view: env.mode === 'view',

      // todo
      // feedback
    //   correctness
    };

    // todo
    // if (env.mode === 'evaluate') {
    //   out.correctResponse = {};
    //   out.config.showNote = showNote;
    //   out.config.note = note;
    // } else {
    //   out.config.responses = [];
    //   out.config.showNote = false;
    // }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
          ? normalizedQuestion.teacherInstructions
          : null;
    } else {
      out.rationale = null;
      out.teacherInstructions = null;
    }

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
