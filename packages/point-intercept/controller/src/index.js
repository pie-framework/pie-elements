import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';

const log = debug('@pie-element:point-intercept:controller');

const getResponseCorrectness = (
  correctResponseWithLabels,
  points,
  graph,
  partialScores
) => {
  const allowPartialScores = graph.allowPartialScoring;
  const pointsMustMatchLabels = graph.pointsMustMatchLabels;

  let correctAnswers = 0;

  if (!points || points.length === 0) {
    return {
      correctness: 'empty',
      score: 0
    };
  }

  points.forEach(point => {
    const isCorrectAnswer = correctResponseWithLabels.find(correctAnswer => {
      const answerPresent =
        correctAnswer.x === point.x && correctAnswer.y === point.y;
      return pointsMustMatchLabels
        ? answerPresent && correctAnswer.label === point.label
        : answerPresent;
    });

    if (isCorrectAnswer) {
      correctAnswers += 1;
    }
  });

  if (correctResponseWithLabels.length === correctAnswers) {
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

export const getCorrectness = (question, session, env) => {
  const { graph, correctResponse, partialScoring } = question;

  if (env.mode === 'evaluate') {
    if (!session || !session.points || session.points.length === 0) {
      return {
        correctness: 'unanswered',
        score: '0%'
      };
    }

    const correctResponseWithLabels = correctResponse.map((answer, idx) => {
      const [x, y] = answer.split(',');

      return {
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        label: graph.pointLabels[idx]
      };
    });

    return getResponseCorrectness(
      correctResponseWithLabels,
      session.points,
      graph,
      partialScoring
    );
  }
};

export function model(question, session, env) {
  return new Promise(resolve => {
    const { graph, correctResponse } = question;

    const correctInfo = getCorrectness(question, session, env);
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
      resolve(out);
    });
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { correctResponse, graph: { pointLabels } } = question;
      const points = [];

      pointLabels.forEach((p, i) => {
        const c = correctResponse[i].split(',');
        points.push({
          x: c[0],
          y: c[1],
          label: p
        })
      });

      resolve({
        id: '1',
        points
      });
    }
  });
};

export const outcome = (question, session, env) => {
  if (env.mode !== 'evaluate') {
    return Promise.reject(
      new Error('Can not call outcome when mode is not evaluate')
    );
  } else {
    return new Promise(resolve => {
      resolve({
        score: getCorrectness(question, session, env).score,
        empty: !session || isEmpty(session)
      });
    });
  }
};
