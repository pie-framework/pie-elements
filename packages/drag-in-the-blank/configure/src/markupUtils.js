import escape from 'lodash/escape';
import isUndefined from 'lodash/isUndefined';

export const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

export const removeUnwantedCharacters = markup => markup.replace(/(\t)|(\n)|(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');

export const processMarkup = markup => {
  const newMarkup = removeUnwantedCharacters(markup);
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
      obj[index] = !isUndefined(c.id) && c.id || '';

      return obj;
    }, {})
  };
};

const REGEX = /\{\{(\d+)\}\}/g;

export const createSlateMarkup = (markup, choices, correctResponse) => {
  const newMarkup = removeUnwantedCharacters(markup);
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

export const choiceIsEmpty = choice => {
  if (choice) {
    const { value = '' } = choice;
    const domEl = createElementFromHTML(value);

    Array.from(domEl.querySelectorAll('*')).forEach((domEl) => {
      if (domEl.tagName !== 'IMG' && domEl.childNodes.length === 0) {
        domEl.remove();
      }
    });

    const newString = domEl.innerHTML.trim();

    return newString === '';
  }

  return false;
};
