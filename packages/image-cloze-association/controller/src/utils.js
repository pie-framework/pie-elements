const getAllCorrectness = (answers, responses) =>
  answers.map(answer => ({
    ...answer,
    isCorrect: (responses[answer.containerIndex].images || []).includes(answer.value)
  }));

const getValidAnswer = (answer, response) =>
  response[answer.containerIndex].filter(res => res === answer.value);

export const getAllUniqueCorrectness = (answers, validResponses) => {
  let allCorrectness = getAllCorrectness(answers, validResponses);

  answers.forEach((answer1) => {
    const valuesToParse = answers.filter(answer2 =>
      (answer2.value === answer1.value) && (answer2.containerIndex === answer1.containerIndex));

    if (valuesToParse.length > 1) {
      // point only to duplicates but first
      valuesToParse.shift();
      // mark duplicates as incorrect
      valuesToParse.forEach((value, index) => {
        allCorrectness = allCorrectness.map(finalAnswer => {
          if (finalAnswer.id === value.id) {
            let valid = getValidAnswer(finalAnswer, validResponses);

            return {
              ...finalAnswer,
              isCorrect: valid.length > index + 1
            }
          }
          return finalAnswer;
        })
      });
    }
  });
  return allCorrectness;
};
