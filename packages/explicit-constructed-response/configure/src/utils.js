export const generateValidationMessage = config => {
  const { maxResponseAreas } = config;

  const responseAreasMessage = '\nThe response area content should ' +
    'not be empty and should be unique.\nThere should be at least 1 ' +
    (maxResponseAreas ? `and at most ${maxResponseAreas} ` : '') +
    'response area' + (maxResponseAreas ? 's' : '') + ' defined.';

  return 'Validation requirements:' + responseAreasMessage;
};
