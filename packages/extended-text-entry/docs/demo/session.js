const { ITEM_COUNT } = require('./generate');

module.exports = Array.from({ length: ITEM_COUNT }, (_, i) => ({
  id: `${i + 1}`,
  element: 'extended-text-entry',
  // value: 'This is test'
}));
