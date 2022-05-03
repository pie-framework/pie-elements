export const generateValidationMessage = config => {
  const { maxResponseAreas } = config;

  const responseAreasMessage = '\nThere should be at least 1 ' +
    (maxResponseAreas ? `and at most ${maxResponseAreas} ` : '') +
    'response area' + (maxResponseAreas ? 's' : '') + ' defined.';

  const message = 'Validation requirements:' + responseAreasMessage;

  return message;
};
