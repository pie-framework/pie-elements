// do not remove \t from \times, \triangle, \tan, \theta or \therefore
const tSymbols = 'imes|riangle|an|heta|herefore';
// do not remove \n from \nthroot, \nparallel, \ncong, \napprox, \neq, \ne or \nsim
const nSymbols = 'throot|parallel|cong|approx|eq|e|sim';
// match all \t and \n that are not part of math symbols that starts with \t or \n
const matchTabAndNewLine = new RegExp(
  `(\\t(?!${tSymbols}))|(\\n(?!${nSymbols}))|(\\\\t(?!${tSymbols}))|(\\\\n(?!${nSymbols}))`,
  'g'
);

export const removeUnwantedCharacters = (markup) =>
  markup.replace(matchTabAndNewLine, '').replace(/\\"/g, '"').replace(/\\\//g, '/');

const createElementFromHTML = (htmlString = '') => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

export const processMarkup = (markup) => {
  const newMarkup = removeUnwantedCharacters(markup || '');
  const slateMarkup = createElementFromHTML(newMarkup || '');

  slateMarkup.querySelectorAll('[data-type="math_templated"]')
    .forEach((s) => s.replaceWith(`{{${s.dataset.index}}}`));

  return slateMarkup.innerHTML;
};

const REGEX = /\{\{(\d+)\}\}/g;

export const createSlateMarkup = (markup) => {
  if (!markup) {
    return '';
  }

  const newMarkup = removeUnwantedCharacters(markup);

  return newMarkup.replace(REGEX, (match, g) => {
    return `<span data-type="math_templated" data-index="${g}" data-value="R ${g}"></span>`;
  });
};
