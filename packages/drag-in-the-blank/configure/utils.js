export const generateValidationMessage = config => {
  let { maxResponseAreas, minChoices, maxChoices } = config;
  minChoices = minChoices || 3;

  const responseAreasMessage = '\nThe tokens should ' +
    'not be empty and should be unique.\nThere should be at least 1 ' +
    (maxResponseAreas ? `and at most ${maxResponseAreas} ` : '') +
    'response area' + (maxResponseAreas ? 's' : '') + ' defined.' +
    `\nThere should be at least ${minChoices} ` +
    (maxChoices ? `and at most ${maxChoices} ` : '') +
    'tokens defined.';

  return 'Validation requirements:' + responseAreasMessage;
};
