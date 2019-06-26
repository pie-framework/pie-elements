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

  const getMenuItem = (el, correctId) => {
    let innerHTML = el.innerHTML && el.innerHTML.replace(/&nbsp;/g, ' ').trim();

    if (!innerHTML) {
      innerHTML = '';
    }

    return {
      label: innerHTML,
      value: el.dataset.id,
      correct: el.dataset.id === correctId
    };
  };

  const getMenuItems = (s, correctId) => {
    return Array.from(s.querySelectorAll('[data-type="menu_item"]')).map(m => getMenuItem(m, correctId));
  };

  slateMarkup.querySelectorAll('[data-type="inline_dropdown"]').forEach(s => {
    const correctId = s.dataset.correctId;

    choices[index] = getMenuItems(s, correctId);
    s.replaceWith(` {{${index++}}} `);
  });

  return {
    markup: slateMarkup.innerHTML,
    choices: choices
  };
};

const REGEX = /\{\{(\d+)\}\}/g;

export const createSlateMarkup = (markup, choices) => {
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
};
