import debug from 'debug';

const log = debug('pie-elements:ebsr:controller');

export function model(question, session, env) {
  return new Promise((resolve, reject) => {
    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      partA: question.partA,
      partB: question.partB,
      prompt: question.prompt,
      choiceMode: question.choiceMode,
      keyMode: question.keyMode,
      shuffle: question.shuffle,
      responseCorrect: [],
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
