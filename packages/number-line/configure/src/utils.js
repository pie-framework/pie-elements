export const generateValidationMessage = () => {
  const baselineValidationMessage =
    '\nThe correct answer should include at least one number line object.';

  return 'Validation requirements:' + baselineValidationMessage;
};
