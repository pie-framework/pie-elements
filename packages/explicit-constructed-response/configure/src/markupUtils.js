import escape from 'lodash/escape';

const createElementFromHTML = (htmlString = '') => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

export const processMarkup = markup => {
  const newMarkup = (markup || '').replace(/(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');
  // <br> causes an infinite normalizing in editable-html for some reason
  const removedBrMarkup = newMarkup.replace(/(<br>)|(<\/br>)/g, '');
  const slateMarkup = createElementFromHTML(removedBrMarkup || '');
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

  // <br> causes an infinite normalizing in editable-html for some reason
  const newMarkup = markup.replace(/(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');
  const removedBrMarkup = newMarkup.replace(/(<br>)|(<\/br>)/g, '');

  return removedBrMarkup.replace(REGEX, (match, g) => {
    const label = choices[g][0].label || '';

    return `<span data-type="explicit_constructed_response" data-index="${g}" data-value="${escape(label)}"></span>`;
  });
};
