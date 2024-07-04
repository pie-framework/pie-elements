export const generateValidationMessage = (config) => {
  let { minChoices, maxChoices, maxCategories } = config || {};
  minChoices = minChoices || 1;

  const validationMessage =
    '\nThe choices content should ' +
    'not be empty and should be unique.\nThere should be at least 1 ' +
    (maxCategories ? `and at most ${maxCategories} ` : '') +
    'category' +
    (maxCategories ? 's' : '') +
    ' defined.' +
    (minChoices ? `\nThere should be at least ${minChoices} choices defined.` : '') +
    (maxChoices ? `\nNo more than ${maxChoices} choices should be defined.` : '') +
    '\nAt least one token should be assigned to at least one category.';

  return 'Validation requirements:' + validationMessage;
};

// used in controller too, for consistency modify it there too
export const multiplePlacements = { enabled: 'Yes', disabled: 'No', perChoice: 'Set Per Choice' };

// Find the length of the largest array from an array
export const maxLength = (array) =>
  (array || []).reduce((max, arr) => {
    return Math.max(max, arr.length);
  }, 0);

export const getMaxCategoryChoices = (model) => {
  const { correctResponse = [] } = model || {};
  return correctResponse.reduce((max, correctRes) => {
    const choicesLength = Math.max(correctRes.choices.length, maxLength(correctRes.alternateResponses));
    return choicesLength > max ? choicesLength : max;
  }, 0);
};
