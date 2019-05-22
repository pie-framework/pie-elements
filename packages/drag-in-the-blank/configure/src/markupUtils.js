const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
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
    markup: slateMarkup.outerHTML,
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
  return markup.replace(REGEX, (match, g) => {
    const correctId = correctResponse[g];
    const correctChoice = choices.find(c => c.id === correctId);

    if (!correctChoice.value) {
      return '';
    }

    return `<span data-type="drag_in_the_blank" data-id="${correctChoice.id}" data-value="${correctChoice.value}"></span>`;
  });
};
