import debug from 'debug';

const log = debug('@pie-element:graphing:controller');

export const getScore = (question, session) => {
  return 0;
};

export function model(question, session, env) {
  return new Promise(resolve => {
    const {
      domain,
      prompt,
      range,
      rationale,
      title,
      chartType,
      labels,
      graph,
      data,
      editCategoryEnabled,
      addCategoryEnabled,
      categoryDefaultLabel
    } = question;

    const correctInfo = { correctness: 'incorrect', score: '0%' };

    const base = {
      correctness: correctInfo,
      disabled: env.mode !== 'gather',
      prompt,
      labels,
      size: graph,

      domain,
      range,
      title,
      rationale,
      chartType,
      data,
      editCategoryEnabled,
      addCategoryEnabled,
      categoryDefaultLabel
    };

    if (env.mode === 'evaluate') {
      const result = getScore(question, session);

      base.answersCorrected = result.correctMarks;
    }

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      base.rationale = question.rationale;
      base.teacherInstructions = question.teacherInstructions;
    } else {
      base.rationale = null;
      base.teacherInstructions = null;
    }

    log('base: ', base);
    resolve(base);
  });
}

export function outcome(model, session) {
  return new Promise(resolve => {
    resolve({ score: getScore(model, session).score });
  });
}
