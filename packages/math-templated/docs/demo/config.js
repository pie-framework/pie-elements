const { model } = require('./generate');

module.exports = {
  elements: {
    'math-templated': '../..',
  },
  models: [model('1', 'math-templated')],
};
