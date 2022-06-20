export const ResponseTypes = {
  advanced: 'Advanced Multi',
  simple: 'Simple'
};

export const generateValidationMessage = (model = {}, config = {}) => {
  const { maxResponseAreas } = config;
  const { responseType } = model;
  let responseAreasMessage = '';

  const answersMessage = '\nAll correct answers (the primary and any alternates) should not be empty and should be unique.';

  if (responseType === 'Advanced Multi') {
    responseAreasMessage = '\nThere should be at least 1 ' +
      (maxResponseAreas ? `and at most ${maxResponseAreas} ` : '') +
      'response area' + (maxResponseAreas ? 's' : '') + ' defined.';
  }

  return 'Validation requirements:' + answersMessage + responseAreasMessage;
};
