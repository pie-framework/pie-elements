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
    s.replaceWith(` {{${index++}}} `);
  });

  return slateMarkup.innerHTML;
};

const REGEX = /\{\{(\d+)\}\}/g;

/*export const createSlateMarkup = (markup, choices) => {
  const newMarkup = markup.replace(/(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');
  const createMenuItem = (id, val) => `<span data-type="menu_item" data-id="${id}">${val}</span>`;
  const createSelect = choices => {
    let correctChoice = choices.find(c => c.correct);
    const menuItems = choices.map(c => createMenuItem(c.value, c.label));

    if (!correctChoice || !correctChoice.value) {
      correctChoice = {
        id: '',
        value: ''
      };
    }

    return `<span data-type="inline_dropdown" data-correct-id="${correctChoice.value}">${menuItems.join('')}</span>`;
  };

  return newMarkup.replace(REGEX, (match, g) => {
    return createSelect(choices[g]);
  });
};*/
export const createSlateMarkup = (markup, choices) => {
  const newMarkup = markup.replace(/(\\t)|(\\n)/g, '').replace(/\\"/g, '"').replace(/\\\//g, '/');
  const createMenuItem = (id, val) => `<span data-type="menu_item" data-id="${id}">${val}</span>`;
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
