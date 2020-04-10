const { model } = require('./generate');

module.exports = {
  elements: {
    'function-entry': '../..'
  },
  models: [model('1', 'function-entry')]
};
