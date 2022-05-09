export const generateValidationMessage = config => {
  const { maxResponseAreas, minChoices, maxChoices } = config;

  const responseAreasMessage = '\nThe tokens should ' +
    'not be empty and should be unique.\nThere should be at least 1 ' +
    (maxResponseAreas ? `and at most ${maxResponseAreas} ` : '') +
    'response area' + (maxResponseAreas ? 's' : '') + ' defined.' +
    `\nThere should be at least ${minChoices} ` +
    (maxChoices ? `and at most ${maxChoices} ` : '') +
    'tokens defined.';

  return 'Validation requirements:' + responseAreasMessage;
};
