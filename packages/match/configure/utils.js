export const generateValidationMessage = model => {
  const { choiceMode } = model;

  const baselineValidationMessage = '\nThere should be at least 1 question row.' +
    '\nRow and column headings should be non-blank and unique.';
  const correctResponseMessage = choiceMode === 'radio'
    ? '\nThere should be a correct response defined for every row.'
    : '\nThere should be at least one correct response defined for every row.';

  return 'Validation requirements:' + baselineValidationMessage + correctResponseMessage;
};
