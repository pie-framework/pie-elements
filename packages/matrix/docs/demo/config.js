const { model } = require('./generate');

module.exports = {
  elements: {
    'matrix-element': '../..'
  },
  models: [model('1', 'matrix-element')]
};
