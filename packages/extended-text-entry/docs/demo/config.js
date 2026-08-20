const { model, ITEM_COUNT } = require('./generate');

// Several items of the same element on one page. One item alone typesets fine, so a multi-item page
// is what shows whether each item asks for math typesetting at a moment its own prompt is in the DOM.
const ids = Array.from({ length: ITEM_COUNT }, (_, i) => `${i + 1}`);

module.exports = {
  elements: {
    'extended-text-entry': '../..',
  },
  models: ids.map((id) => model(id, 'extended-text-entry')),
};
