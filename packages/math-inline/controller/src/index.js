import debug from 'debug';
import { getFeedbackForCorrectness } from '@pie-lib/feedback';
// need math stuff in here for comparison, math-evaluator @pie-lib

const log = debug('@pie-element:math-inline:controller');

const getResponseCorrectness = (
  model,
  answers
) => {
  console.log(model);
  console.log(answers);

  // if (!answers || Object.keys(answers).length === 0) {
  //   return 'unanswered';
  // }
  //
  // const totalCorrectAnswers = getTotalCorrect(model);
  // const correctAnswers = getCorrectSelected(rows, answers);
  //
  // if (totalCorrectAnswers === correctAnswers) {
  //   return  'correct';
  // } else if (correctAnswers === 0) {
  //   return 'incorrect';
  // } else if (allowPartialScores && partialScoring) {
  //   return 'partial';
  // }

  return 'incorrect';
};

const getCorrectness = (question, env, answers) => {
  if (env.mode === 'evaluate') {
    return getResponseCorrectness(
      question,
      answers
    );
  }
};

// const getCorrectSelected = (rows, answers) => {
//   let correctAnswers = 0;
//
//   rows.forEach(row => {
//     const answer = answers[row.id];
//
//     if (answer) {
//       row.values.forEach((v, i) => {
//         if (answer[i] === v) {
//           correctAnswers += 1;
//         }
//       });
//     }
//   });
//
//   return correctAnswers;
// };

export function model(question, session, env) {
  return new Promise(resolve => {
    const correctness = getCorrectness(question, env, session.answers);
    const correctResponse = {};
    const correctInfo = {
      correctness
    };

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
        correctResponse
      });
      log('out: ', out);
      resolve(out);
    });
  });
}
