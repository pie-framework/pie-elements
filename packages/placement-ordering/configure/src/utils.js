export const generateValidationMessage = () => {
  const answersMessage = '\nThere should be at least 3 tokens.' +
    '\nThe tokens should not be empty and should be unique.' +
    '\nThe correct ordering should not be identical to the initial ordering.';

  return 'Validation requirements:' + answersMessage;
};
