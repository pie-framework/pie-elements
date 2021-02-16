import escape from 'lodash/escape';

export const removeUnwantedCharacters = markup =>
  markup
    .replace(/(\t+(?!imes))|(\n)|(\\t+(?!imes))|(\\n)/g, '')
    .replace(/\\"/g, '"').replace(/\\\//g, '/');

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
