import escape from 'lodash/escape';

const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

export const processMarkup = markup => {
  const newMarkup = markup.replace(/(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');
  const slateMarkup = createElementFromHTML(newMarkup);
  const choices = [];
  let index = 0;

  slateMarkup.querySelectorAll('[data-type="drag_in_the_blank"]').forEach(s => {
    let value = s.dataset.value && s.dataset.value.replace(/&nbsp;/g, ' ').trim();

    if (!value) {
      value = '';
    }

    choices.push({
      value,
      id: s.dataset.id
    });

    s.replaceWith(`{{${index++}}}`);
  });

  return {
    markup: slateMarkup.innerHTML,
    choices: choices,
    correctResponse: choices.reduce((obj, c, index) => {
      obj[index] = c.id;

      return obj;
    }, {})
  };
};

const REGEX = /\{\{(\d+)\}\}/g;

export const createSlateMarkup = (markup, choices, correctResponse) => {
  const newMarkup = markup.replace(/(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');
  let index = 0;

  return newMarkup.replace(REGEX, (match, g) => {
    const correctId = correctResponse[g];
    let correctChoice = choices.find(c => c.id === correctId);

    if (!correctChoice || !correctChoice.value) {
      correctChoice = {
        id: '',
        value: ''
      };
    }

    return `<span data-type="drag_in_the_blank" data-index="${index++}" data-id="${correctChoice.id}" data-value="${escape(correctChoice.value)}"></span>`;
  });
};
