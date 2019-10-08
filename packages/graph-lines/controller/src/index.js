import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { lineUtils as utils } from '@pie-lib/charting';
import isEmpty from 'lodash/isEmpty';

const log = debug('@pie-element:graph-lines:controller');

const getResponseCorrectness = (
  correctResponse,
  lines,
  model,
  partialScores
) => {
  const allowPartialScores = model.configure.allowPartialScoring;
  const correctExpressions = correctResponse.map(line => utils.expression(line.from, line.to));
  let correctAnswers = 0;

  if (!lines || lines.length === 0) {
    return {
      correctness: 'empty',
      score: 0
    };
  }

  lines.forEach(line => {
    const isCorrectAnswer = correctExpressions.find(correctExpression => correctExpression.equals(line.expression || utils.expression(line.from, line.to)));

    if (isCorrectAnswer) {
      correctAnswers += 1;
    }
  });

  if (correctExpressions.length === correctAnswers) {
    return { correctness: 'correct', score: '100%' };
  } else if (correctAnswers === 0) {
    return { correctness: 'incorrect', score: '0%' };
  } else if (allowPartialScores && partialScores && partialScores.length) {
    return {
      correctness: 'partial',
      score: `${(
        partialScores.find(
          partialScore => partialScore.numberOfCorrect === correctAnswers
        ) || {}
      ).scorePercentage || 0}%`
    };
  }

  return { correctness: 'incorrect', score: '0%' };
};

export const getCorrectness = (question, session, env = {}) => {
  const { partialScoring, graph } = question;
  const correctResponse = [];

  if (env.mode === 'evaluate') {
    if (!session || !session.lines || session.lines.length === 0) {
      return {
        correctness: 'unanswered',
        score: '0%'
      };
    }

    graph.lines.forEach(line => {
      const lineExpression = utils.expressionFromDescriptor(line.correctLine);
      const points = utils.pointsFromExpression(lineExpression);

      correctResponse.push(Object.assign({}, line, points, { expression: lineExpression }));
    });

    return getResponseCorrectness(
      correctResponse,
      session.lines,
      question,
      partialScoring
    );
  }
};

export const normalize = question => ({
  promptEnabled: true,
  rationaleEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  ...question,
});

export function model(question, session, env) {
  return new Promise(resolve => {
    const normalizedQuestion = normalize(question);
    const { graph } = normalizedQuestion;

    const correctResponse = [];

    graph.lines.forEach(line => {
      const lineExpression = utils.expressionFromDescriptor(line.correctLine);
      const points = utils.pointsFromExpression(lineExpression);

      correctResponse.push(Object.assign({}, line, points, { expression: lineExpression }));
    });

    const correctInfo = getCorrectness(normalizedQuestion, session, env);
    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctInfo.correctness, normalizedQuestion.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        correctness: correctInfo,
        feedback,
        disabled: env.mode !== 'gather'
      };

      const out = Object.assign(base, {
        graph,
        correctResponse: env.mode === 'evaluate' ? correctResponse : undefined
      });

      if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
        out.rationale = normalizedQuestion.rationaleEnabled ? normalizedQuestion.rationale : null;
      } else {
        out.rationale = null;
      }

      out.prompt = normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null;

      log('out: ', out);
      resolve(out);
    });
  });
}

export function outcome(model, session) {
  return new Promise(resolve => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    }

    const correctness = getCorrectness(model, session);
    resolve({ score: correctness ? correctness.score : 0 });
  });
}
