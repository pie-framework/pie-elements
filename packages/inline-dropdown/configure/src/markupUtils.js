/*const slateMarkup = createElementFromHTML(`
<div>
    <p>
        The
        <span data-type="select" data-correct-id="0">
            <span data-type="menu_item" data-id="0">cow </span>
            <span data-type="menu_item" data-id="1">dog </span>
            <span data-type="menu_item" data-id="2">cat </span>
        </span>
        jumped
        <span data-type="select" data-correct-id="0">
            <span data-type="menu_item" data-id="0">over </span>
            <span data-type="menu_item" data-id="1">under </span>
            <span data-type="menu_item" data-id="2">across </span>
        </span>
        the
        <span data-type="select" data-correct-id="0">
            <span data-type="menu_item" data-id="0">moon </span>
            <span data-type="menu_item" data-id="2" data-is-default="true">sun</span>
            <span data-type="menu_item" data-id="3">house </span>
        </span>
    </p>
</div>
`);*/

const createElementFromHTML = htmlString => {
  const div = document.createElement('div');

  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
};

export const processMarkup = markup => {
  const slateMarkup = createElementFromHTML(markup);
  const choices = {};
  let index = 0;

  const getMenuItem = (el, correctId) => {
    const innerHTML = el.innerHTML && el.innerHTML.replace(/&nbsp;/g, ' ').trim();
    // const innerHTML = el.textContent && el.textContent.replace(/&nbsp;/g, ' ').trim();

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
    markup: slateMarkup.outerHTML,
    choices: choices
  };
};

const REGEX = /\{\{(\d?)\}\}/g;

export const createSlateMarkup = (markup, choices) => {
  const createMenuItem = (id, val) => `<span data-type="menu_item" data-id="${id}">${val}</span>`;
  const createSelect = choices => {
    const correctChoice = choices.find(c => c.correct);
    const menuItems = choices.map(c => createMenuItem(c.value, c.label));

    return `<span data-type="inline_dropdown" data-correct-id="${correctChoice.value}">${menuItems.join('')}</span>`;
  };

  return markup.replace(REGEX, (match, g) => {
    return createSelect(choices[g]);
  });
};
