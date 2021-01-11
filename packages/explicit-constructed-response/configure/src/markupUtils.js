import escape from 'lodash/escape';

export const removeUnwantedCharacters = markup =>
  markup
    .replace(/(\t)|(\n)|(\\t)|(\\n)/g, '')
    .replace(/\\"/g, '"').replace(/\\\//g, '/');

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
