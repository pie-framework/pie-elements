export const generateValidationMessage = config => {
  const { maxResponseAreas, maxResponseAreaChoices } = config;

  const responseAreasMessage = '\nThere should be at least 1 ' +
    (maxResponseAreas ? `and at most ${maxResponseAreas} ` : '') +
    'response area' + (maxResponseAreas ? 's' : '') + ' defined.' +
    (maxResponseAreaChoices ? `\nThere should be at most ${maxResponseAreaChoices} choices defined per response area.` : '');

  const message = 'Validation requirements:' + responseAreasMessage;

  return message;
};
