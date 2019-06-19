const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

export const processMarkup = markup => {
  const slateMarkup = createElementFromHTML(markup);
  const choices = {};
  let index = 0;

  slateMarkup.querySelectorAll('[data-type="explicit_constructed_response"]').forEach(s => {
    const innerHTML = s.innerHTML && s.innerHTML.replace(/&nbsp;/g, ' ').trim();

    choices[index] = [{
      label: innerHTML,
      id: '0'
    }];
    s.replaceWith(` {{${index++}}} `);
  });

  return {
    markup: slateMarkup.innerHTML,
    choices: choices
  };
};

const REGEX = /\{\{(\d?)\}\}/g;

export const createSlateMarkup = (markup, choices) => {
  return markup.replace(REGEX, (match, g) => {
    return `<span data-type="explicit_constructed_response">${choices[g][0].label}</span>`;
  });
};
