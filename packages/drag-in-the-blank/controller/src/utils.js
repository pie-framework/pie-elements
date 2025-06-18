import cloneDeep from 'lodash/cloneDeep';

const replaceHtmlRegex = /<(?!img)[^>]*>?/gm;

export const getAllCorrectResponses = ({ correctResponse = {}, alternateResponses = {} }) =>
  Object.entries(correctResponse).reduce(
    (acc, [key, val]) => {
      acc.possibleResponses[key] = [val, ...(alternateResponses[key] ? cloneDeep(alternateResponses[key]) : [])];

      const length = acc.possibleResponses[key].length;
      acc.numberOfPossibleResponses = acc.numberOfPossibleResponses === undefined
        ? length
        : Math.min(acc.numberOfPossibleResponses, length);

      return acc;
    },
    {
      possibleResponses: {},
      numberOfPossibleResponses: undefined,
    },
  );

export const choiceIsEmpty = (choice) => {
  if (choice) {
    const { value = '' } = choice;
    const withoutEmptyTags = value.replace(replaceHtmlRegex, '') || '';

    return withoutEmptyTags.trim() === '';
  }

  return false;
};
