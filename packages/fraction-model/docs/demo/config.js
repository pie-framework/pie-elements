const { model } = require('./generate');

module.exports = {
  elements: {
    'fraction-model': '../..',
  },
  models: [model('1', 'fraction-model')],
};
