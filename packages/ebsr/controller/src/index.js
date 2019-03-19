import debug from 'debug';
import { isResponseCorrect } from './utils';

const log = debug('pie-elements:ebsr:controller');

const parsePart = (part, session, env) => ({
  ...part,
  disabled: env.mode !== 'gather',
  complete: {
    min: part.choices.filter(c => c.correct).length
  },
  responseCorrect:
    env.mode === 'evaluate'
      ? isResponseCorrect(part, session)
      : undefined
});

export function model(question, session, env) {
  return new Promise((resolve, reject) => {
    const { mode, shuffle } = question;

    const partA = parsePart(question.partA, session, env);
    const partB = parsePart(question.partB, session, env);

    const out = {
      mode,
      partA,
      partB,
      shuffle,
    };

    resolve(out);
  });
}

export function outcome(config, session, env) {
  return new Promise((resolve, reject) => {
    log('outcome...');
    // const maxScore = config.choices.length;
    //
    // const chosen = c => !!(session.value || []).find(v => v === c.value);
    // const correctAndNotChosen = c => isCorrect(c) && !chosen(c);
    // const incorrectAndChosen = c => !isCorrect(c) && chosen(c);
    // const correctCount = config.choices.reduce((total, choice) => {
    //   if (correctAndNotChosen(choice) || incorrectAndChosen(choice)) {
    //     return total - 1;
    //   } else {
    //     return total;
    //   }
    // }, config.choices.length);
    //
    // if (!config.partialScoring && correctCount < maxScore) {
    //   resolve({ score: 0 });
    // } else {
      // const scoreString = ( correctCount / config.choices.length ).toFixed(2);

      resolve( {score: 'some score' });
    // }
  });
}
