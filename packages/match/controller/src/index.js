import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';

const log = debug('@pie-element:graph-lines:controller');

const getResponseCorrectness = (
  model,
  answers
) => {
  const allowPartialScores = model.allowPartialScoring;
  const partialScoring = model.partialScoring;
  const rows = model.rows;
  let totalCorrectAnswers = 0;
  let correctAnswers = 0;

  if (!answers || Object.keys(answers).length === 0) {
    return {
      correctness: 'empty',
      score: 0
    };
  }

  if (rows.length) {
    totalCorrectAnswers += rows.length * (model.layout - 1);
  }

  rows.forEach(row => {
    const answer = answers[row.id];

    if (answer) {
      row.values.forEach((v, i) => {
        if (answer[i] === v) {
          correctAnswers += 1;
        }
      });
    }
  });

  if (totalCorrectAnswers === correctAnswers) {
    return { correctness: 'correct', score: '100%' };
  } else if (correctAnswers === 0) {
    return { correctness: 'incorrect', score: '0%' };
  } else if (allowPartialScores && partialScoring) {
    return {
      correctness: 'partial',
      score: `${(correctAnswers / totalCorrectAnswers * 100).toFixed(2).replace(/[.,]00$/, '')}%`
    };
  }

  return { correctness: 'incorrect', score: '0%' };
};

export function model(question, session, env) {
  return new Promise(resolve => {
    const getCorrectness = () => {
      if (env.mode === 'evaluate') {
        if (!session.answers || Object.keys(session.answers).length === 0) {
          return {
            correctness: 'unanswered',
            score: '0%'
          };
        }

        return getResponseCorrectness(
          question,
          session.answers
        );
      }
    };

    const correctInfo = getCorrectness();
    const correctResponse = {};

    question.rows.forEach(row => {
      correctResponse[row.id] = row.values;
    });

    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctInfo.correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        config: question,
        correctness: correctInfo,
        feedback,
        disabled: env.mode !== 'gather',
        view: env.mode === 'view'
      };

      const out = Object.assign(base, {
        correctResponse: env.mode === 'evaluate' ? correctResponse : undefined
      });
      log('out: ', out);
      resolve(out);
    });
  });
}
