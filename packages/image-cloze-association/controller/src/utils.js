// functions also used in src/utils-correctness.js

const getAllCorrectness = (answers, responses) =>
  (answers || []).map((answer) => ({
    ...answer,
    isCorrect: ((responses[answer.containerIndex] && responses[answer.containerIndex].images) || []).includes(
      answer.value,
    ),
  }));

const getValidAnswer = (answer, response) =>
  ((response[answer.containerIndex] && response[answer.containerIndex].images) || []).filter(
    (res) => res === answer.value,
  );

export const getAllUniqueCorrectness = (answers, validResponses) => {
  let allCorrectness = getAllCorrectness(answers, validResponses);

  answers.forEach((answer1) => {
    const valuesToParse = answers.filter(
      (answer2) => answer2.value === answer1.value && answer2.containerIndex === answer1.containerIndex,
    );

    if (valuesToParse.length > 1) {
      // point only to duplicates but first
      valuesToParse.shift();
      // mark duplicates as incorrect
      valuesToParse.forEach((value, index) => {
        allCorrectness = (allCorrectness || []).map((finalAnswer) => {
          if (finalAnswer.id === value.id) {
            let valid = getValidAnswer(finalAnswer, validResponses);
            return {
              ...finalAnswer,
              isCorrect: valid.length > index + 1,
            };
          }
          return finalAnswer;
        });
      });
    }
  });
  return allCorrectness;
};

// calculate the minimum number of populated response areas (categories) in the correct answer or alternates
// and create an array with the possible responses ids
export const getCompleteResponseDetails = (validation) => {
  const extractImages = (response) => response.value.map((container) => container.images);
  const countFilledResponseAreas = (container) => container.filter((images) => images.length).length;

  const { validResponse, altResponses } = validation || {};
  const imagesPerContainer = extractImages(validResponse);
  const possibleResponses = [imagesPerContainer.flat()];
  let responseAreasToBeFilled = countFilledResponseAreas(imagesPerContainer);

  (altResponses || []).forEach((altResponse) => {
    const altImagesPerContainer = extractImages(altResponse);
    const filledResponseAreas = countFilledResponseAreas(altImagesPerContainer);
    possibleResponses.push(altImagesPerContainer.flat());

    if (filledResponseAreas < responseAreasToBeFilled) {
      responseAreasToBeFilled = filledResponseAreas;
    }
  });

  return { responseAreasToBeFilled, possibleResponses };
  // return responseAreasToBeFilled;

  // const choicesPerCategory = correctResponse.map((category) => category.choices);
  // const possibleResponses = [choicesPerCategory.flat()];
  // let responseAreasToBeFilled = choicesPerCategory.filter((choices) => choices.length).length;
  //
  // if (alternates.length) {
  //   const alternatesPerChoice = alternates[0]?.length || 0; // number of alternates
  //
  //   [...Array(alternatesPerChoice).keys()].forEach((index) => {
  //     const alternatesPerResponse = alternates.map((alternate) => alternate[index]);
  //     const filledCategories = alternatesPerResponse.filter((category) => category?.length).length;
  //     possibleResponses.push(alternatesPerResponse.flat());
  //
  //     if (filledCategories < responseAreasToBeFilled) {
  //       responseAreasToBeFilled = filledCategories;
  //     }
  //   });
  // }
};
