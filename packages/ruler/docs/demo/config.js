const { model } = require('./generate');

module.exports = {
  elements: {
    'ruler-element': '../..'
  },
  models: [model('1', 'ruler-element')]
};
