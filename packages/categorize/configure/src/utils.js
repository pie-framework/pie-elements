export const generateValidationMessage = config => {
  const { minChoices = 1, maxChoices, maxCategories } = config;

  const validationMessage = '\nThe choices content should ' +
    'not be empty and should be unique.\nThere should be at least 1 ' +
    (maxCategories ? `and at most ${maxCategories} ` : '') +
    'category' + (maxCategories ? 's' : '') + ' defined.' +
    (minChoices ? `\nThere should be at least ${minChoices} choices defined.` : '') +
    (maxChoices ? `\nNo more than ${maxChoices} choices should be defined.` : '') +
    '\nAt least one token should be assigned to at least one category.';

  return 'Validation requirements:' + validationMessage;
};
