const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

export const processMarkup = markup => {
  const slateMarkup = createElementFromHTML(markup);
  const choices = [];
  let index = 0;

  slateMarkup.querySelectorAll('[data-type="drag_in_the_blank"]').forEach(s => {
    const value = s.dataset.value && s.dataset.value.replace(/&nbsp;/g, ' ').trim();

    if (value) {
      choices.push({
        value,
        id: s.dataset.id
      });
    }

    s.replaceWith(value ? ` {{${index++}}} ` : '');
  });

  return {
    markup: slateMarkup.innerHTML,
    choices: choices,
    correctResponse: choices.reduce((obj, c, index) => {
      if (c.value) {
        obj[index] = c.id;
      }

      return obj;
    }, {})
  };
};

const REGEX = /\{\{(\d?)\}\}/g;

export const createSlateMarkup = (markup, choices, correctResponse) => {
  let index = 0;

  return markup.replace(REGEX, (match, g) => {
    const correctId = correctResponse[g];
    const correctChoice = choices.find(c => c.id === correctId);

    if (!correctChoice.value) {
      return '';
    }

    return `<span data-type="drag_in_the_blank" data-index="${index++}" data-id="${correctChoice.id}" data-value="${correctChoice.value}"></span>`;
  });
};
