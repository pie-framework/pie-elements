import escape from 'lodash/escape';

const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

export const processMarkup = markup => {
  const newMarkup = markup.replace(/(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');
  const slateMarkup = createElementFromHTML(newMarkup);
  let index = 0;

  slateMarkup.querySelectorAll('[data-type="inline_dropdown"]').forEach(s => {
    s.replaceWith(`{{${index++}}}`);
  });

  return slateMarkup.innerHTML;
};

const REGEX = /\{\{(\d+)\}\}/g;

export const createSlateMarkup = (markup, choices) => {
  const newMarkup = markup.replace(/(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');
  const createSelect = index => {
    let correctChoice = choices[index].find(c => c.correct);

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
