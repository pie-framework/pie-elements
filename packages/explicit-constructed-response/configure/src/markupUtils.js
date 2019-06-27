const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  return div;
};

export const processMarkup = markup => {
  const newMarkup = markup.replace(/(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');
  const slateMarkup = createElementFromHTML(newMarkup);
  const choices = {};
  let index = 0;

  slateMarkup.querySelectorAll('[data-type="explicit_constructed_response"]').forEach(s => {
    let innerHTML = s.innerHTML && s.innerHTML.replace(/&nbsp;/g, ' ').trim();

    if (innerHTML) {
      innerHTML = '';
    }

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

const REGEX = /\{\{(\d+)\}\}/g;

export const createSlateMarkup = (markup, choices) => {
  if (!markup) {
    return '';
  }

  const newMarkup = markup.replace(/(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');

  return newMarkup.replace(REGEX, (match, g) => {
    const label = choices[g][0].label || '';

    return `<span data-type="explicit_constructed_response">${label}</span>`;
  });
};
