const { model } = require('./generate');

module.exports = {
  elements: {
    'protractor-element': '../..'
  },
  models: [model('1', 'protractor-element')]
};
