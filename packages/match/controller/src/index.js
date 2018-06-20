import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
import { lineUtils as utils } from '@pie-lib/charting';

const log = debug('@pie-element:graph-lines:controller');

const getResponseCorrectness = (
  model,
  answers
) => {
  // const allowPartialScores = model.config.allowPartialScoring;
  // const correctExpressions = correctResponse.map(line => utils.expression(line.from, line.to));
  // let correctAnswers = 0;
  //
  // if (!lines || lines.length === 0) {
  //   return {
  //     correctness: 'empty',
  //     score: 0
  //   };
  // }
  //
  // lines.forEach(line => {
  //   const isCorrectAnswer = correctExpressions.find(correctExpression => correctExpression.equals(line.expression || utils.expression(line.from, line.to)));
  //
  //   if (isCorrectAnswer) {
  //     correctAnswers += 1;
  //   }
  // });
  //
  // if (correctExpressions.length === correctAnswers) {
  //   return { correctness: 'correct', score: '100%' };
  // } else if (correctAnswers === 0) {
  //   return { correctness: 'incorrect', score: '0%' };
  // } else if (allowPartialScores && partialScores && partialScores.length) {
  //   return {
  //     correctness: 'partial',
  //     score: `${(
  //       partialScores.find(
  //         partialScore => partialScore.numberOfCorrect === correctAnswers
  //       ) || {}
  //     ).scorePercentage || 0}%`
  //   };
  // }

  return { correctness: 'incorrect', score: '0%' };
};

export function model(question, session, env) {
  return new Promise(resolve => {
    const getCorrectness = () => {
      if (env.mode === 'evaluate') {
        if (!session.answers || session.answers.length === 0) {
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
    const fb =
      env.mode === 'evaluate'
        ? getFeedbackForCorrectness(correctInfo.correctness, question.feedback)
        : Promise.resolve(undefined);

    fb.then(feedback => {
      const base = {
        config: question,
        correctness: correctInfo,
        feedback,
        disabled: env.mode !== 'gather'
      };

      const out = Object.assign(base, {
        correctResponse: env.mode === 'evaluate' ? question.rows : undefined
      });
      log('out: ', out);
      resolve(out);
    });
  });
}
