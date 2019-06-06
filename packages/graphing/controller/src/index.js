import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { lineUtils as utils } from '@pie-lib/charting';

const log = debug('@pie-element:graphing:controller');

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

export function model(question, session, env) {
  return new Promise(resolve => {
    const { partialScoring, graph } = question;

    const correctResponse = [];

    // Added because pie-ui was crashing
    graph.lines = [
      {
        label: 'Line One',
        correctLine: '3x+2',
        initialView: '3x+3'
      }
    ];
    graph.title = 'Title';
    graph.domain = {
      min: -5,
      max: 10,
      stepValue: 1,
      snapValue: 1,
      padding: 0
    };
    graph.range = {
      min: -5,
      max: 10,
      stepValue: 1,
      snapValue: 1,
      padding: 0
    };
    graph.width = 400;
    graph.height = 400;
    // Added because pie-ui was crashing

    graph && graph.lines && graph.lines.forEach(line => {
      const lineExpression = utils.expressionFromDescriptor(line.correctLine);
      const points = utils.pointsFromExpression(lineExpression);

      correctResponse.push(Object.assign({}, line, points, { expression: lineExpression }));
    });

    const getCorrectness = () => {
      if (env.mode === 'evaluate') {
        if (!session.lines || session.lines.length === 0) {
          return {
            correctness: 'unanswered',
            score: '0%'
          };
        }

        return getResponseCorrectness(
          correctResponse,
          session.lines,
          question,
          partialScoring
        );
      }
    };

    const correctInfo = getCorrectness();
    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctInfo.correctness, question.feedback)
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
        out.rationale = question.rationale;
      } else {
        out.rationale = null;
      }

      log('out: ', out);
      resolve(out);
    });
  });
}
