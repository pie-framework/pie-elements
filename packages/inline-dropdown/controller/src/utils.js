import forEach from 'lodash/forEach';

export const getAllCorrectResponses = ({ choices, alternateResponse }) => {
  alternateResponse = alternateResponse || {};
  const correctAnswers = {};

  forEach(choices, (respArea, key) => {
    if (!correctAnswers[key]) {
      correctAnswers[key] = [];
    }

    if (respArea) {
      respArea.forEach((choice) => {
        if (choice.correct) {
          correctAnswers[key].push(choice.value);

          if (alternateResponse[key]) {
            correctAnswers[key] = [...correctAnswers[key], ...alternateResponse[key]];
          }
        }
      });
    }
  });

  return correctAnswers;
};
