import escape from 'lodash/escape';

// do not remove \t from \times, \triangle, \tan, \theta or \therefore
const tSymbols = 'imes|riangle|an|heta|herefore';
// do not remove \n from \nthroot, \nparallel, \ncong, \napprox, \neq, \ne or \nsim
const nSymbols = 'throot|parallel|cong|approx|eq|e|sim';
// match all \t and \n that are not part of math symbols that starts with \t or \n
const matchTabAndNewLine = new RegExp(`(\t(?!${tSymbols}))|(\n(?!${nSymbols}))|(\\t(?!${tSymbols}))|(\\n(?!${nSymbols}))`, 'g');

export const removeUnwantedCharacters = markup =>
  markup.replace(matchTabAndNewLine, '').replace(/\\"/g, '"').replace(/\\\//g, '/');

const createElementFromHTML = (htmlString = '') => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

export const processMarkup = markup => {
  const newMarkup = removeUnwantedCharacters(markup || '');
  const slateMarkup = createElementFromHTML(newMarkup || '');
  let index = 0;

  slateMarkup.querySelectorAll('[data-type="explicit_constructed_response"]').forEach(s => {
    s.replaceWith(`{{${index++}}}`);
  });

  return slateMarkup.innerHTML;
};

const REGEX = /\{\{(\d+)\}\}/g;

export const createSlateMarkup = (markup, choices) => {
  if (!markup) {
    return '';
  }

  const newMarkup = removeUnwantedCharacters(markup);

  return newMarkup.replace(REGEX, (match, g) => {
    const label = choices[g][0].label || '';

    return `<span data-type="explicit_constructed_response" data-index="${g}" data-value="${escape(label)}"></span>`;
  });
};

// also used in controller/src/index.js
export const getAdjustedLength = length => {
  if (length <= 2) {
    return length + 2;
  }

  if (length <= 4) {
    return length + 3;
  }

  if (length <= 6) {
    return length + 4;
  }

  return length + 5;
};
