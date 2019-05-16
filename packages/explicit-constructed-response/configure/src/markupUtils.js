/*const slateMarkup = createElementFromHTML(`
<div>
    <p>
        The
        <span data-type="explicit_constructed_response">cow</span>
        jumped
        <span data-type="explicit_constructed_response">over</span>
        the
        <span data-type="explicit_constructed_response">moon</span>
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

  slateMarkup.querySelectorAll('[data-type="explicit_constructed_response"]').forEach(s => {
    const innerHTML = s.innerHTML && s.innerHTML.replace(/&nbsp;/g, ' ').trim();

    choices[index] = [{
      label: innerHTML,
      value: '0'
    }];
    s.replaceWith(` {{${index++}}} `);
  });

  return {
    markup: slateMarkup.outerHTML,
    choices: choices
  };
};

const REGEX = /\{\{(\d?)\}\}/g;

export const createSlateMarkup = (markup, choices) => {
  return markup.replace(REGEX, (match, g) => {
    return `<span data-type="explicit_constructed_response">${choices[g][0].label}</span>`;
  });
};
