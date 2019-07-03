import forEach from 'lodash/forEach';

export const getAllCorrectResponses = ({ choices, alternateResponse }) => {
  const correctAnswers = {};

  forEach(choices, (respArea, key) => {
    if (!correctAnswers[key]) {
      correctAnswers[key] = [];
    }

    respArea.forEach(choice => {
      if (choice.correct) {
        correctAnswers[key].push(choice.value);

        if (alternateResponse[key]) {
          correctAnswers[key] = [
            ...correctAnswers[key],
            ...alternateResponse[key]
          ]
        }
      }
    })
  });

  return correctAnswers;
};
