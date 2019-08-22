const { model } = require('./generate');

module.exports = {
  elements: {
    'math-inline': '../..'
  },
  models: [model('1', 'math-inline')]
};
