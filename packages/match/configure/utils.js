export const generateValidationMessage = (model, configuration) => {
  const { choiceMode } = model;
  const { minQuestions, maxQuestions, maxAnswers } = configuration;

  const baselineValidationMessage =
    `\nThere should be at least ${minQuestions}` +
    (maxQuestions ? ` and at most ${maxQuestions}` : '') +
    ' question row' + (minQuestions > 1 || maxQuestions ? 's.' : '.') +
    '\nRow and column headings should be non-blank and unique. \nFirst column heading is excluded from validation.' +
    (maxAnswers ? `\nThere should be at most ${maxAnswers} answer choices.` : '')
  ;

  const correctResponseMessage =
    choiceMode === 'radio'
      ? '\nThere should be a correct response defined for every row.'
      : '\nThere should be at least one correct response defined for every row.';

  return 'Validation requirements:' + baselineValidationMessage + correctResponseMessage;
};
