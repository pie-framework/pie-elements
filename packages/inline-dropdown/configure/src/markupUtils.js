import escape from 'lodash/escape';

// do not remove \t from \times, \triangle, \tan, \theta or \therefore
const tSymbols = 'imes|riangle|an|heta|herefore';
// do not remove \n from \nthroot, \nparallel, \ncong, \napprox, \neq, \ne or \nsim
const nSymbols = 'throot|parallel|cong|approx|eq|e|sim';
// match all \t and \n that are not part of math symbols that starts with \t or \n
const matchTabAndNewLine = new RegExp(`(\\t(?!${tSymbols}))|(\\n(?!${nSymbols}))|(\\\\t(?!${tSymbols}))|(\\\\n(?!${nSymbols}))`, 'g');

export const removeUnwantedCharacters = markup =>
  markup.replace(matchTabAndNewLine, '').replace(/\\"/g, '"').replace(/\\\//g, '/');

export const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

export const processMarkup = markup => {
  const newMarkup = removeUnwantedCharacters(markup);
  const slateMarkup = createElementFromHTML(newMarkup);

  slateMarkup.querySelectorAll('[data-type="inline_dropdown"]').forEach(s => {
    s.replaceWith(`{{${s.dataset.index}}}`);
  });

  return slateMarkup.innerHTML;
};

const REGEX = /\{\{(\d+)\}\}/g;

export const createSlateMarkup = (markup, choices) => {
  const newMarkup = removeUnwantedCharacters(markup);
  const createSelect = index => {
    let correctChoice = choices[index] && choices[index].find(c => c.correct);

    if (!correctChoice || !correctChoice.value) {
      correctChoice = {
        id: '',
        value: '',
        label: ''
      };
    }

    return `<span data-type="inline_dropdown" data-index="${index}" data-value="${escape(correctChoice.label)}"></span>`;
  };

  return newMarkup.replace(REGEX, (match, g) => {
    return createSelect(g);
  });
};
