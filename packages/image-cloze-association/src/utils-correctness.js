const getAllCorrectAnswers = (answers, responses) =>
  answers.map(answer => ({
    ...answer,
    isCorrect: responses[answer.containerIndex].includes(answer.value)
  }));

const getValidAnswer = (answer, response) => response[answer.containerIndex].filter(res => res === answer.value);

const getUniqueCorrectAnswers = (answers, validResponses) => {
  let finalAnswers = answers;

  answers.forEach((answer1) => {
    const valuesToParse = answers.filter(answer2 =>
      (answer2.value === answer1.value) && (answer2.containerIndex === answer1.containerIndex));

    if (valuesToParse.length > 1) {
      // point only to duplicates but first
      valuesToParse.shift();
      // mark duplicates as incorrect
      valuesToParse.forEach((value, index) => {
        finalAnswers = finalAnswers.map(finalAnswer => {
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
  return finalAnswers;
};

export const getAnswersCorrectness = (answers, validation) => {
  const { validResponse: { value }, altResponses } = validation;

  const allCorrect = getAllCorrectAnswers(answers, value);
  const uniqueAnswers = getUniqueCorrectAnswers(allCorrect, value);
  const noOfCorrect = uniqueAnswers.filter(answer => answer.isCorrect).length;

  // Look for alternate correct responses if there are incorrect responses.
  if ((noOfCorrect < uniqueAnswers.length) && (altResponses && altResponses.length)) {
    const altUniqueStack = altResponses.map(altResponse => {
      const altValue = altResponse.value;

      const altAllCorrect = getAllCorrectAnswers(answers, altValue);
      return getUniqueCorrectAnswers(altAllCorrect, altValue);
    });
    // Return the one with most correct answers.
    return altUniqueStack.sort((a, b) => b.filter(c => c.isCorrect).length - a.filter(c => c.isCorrect).length)[0];
  }
  return uniqueAnswers;
};
