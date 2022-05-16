export const generateValidationMessage = () => {
  const baselineValidationMessage = '\nWidth should be a value between 200 and 800.' +
    '\nMin and max must both be in the range [-100000, 10000].' +
    '\nMax must be greater than min.' +
    '\nMax number of elements should be between 1 and 20.' +
    '\nThe correct answer should include at least one number line object.';

  return 'Validation requirements:' + baselineValidationMessage;
};
