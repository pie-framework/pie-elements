const generate = require('./generate');

module.exports = {
  elements: {
    'calculator-el': '../..'
  },
  models: [generate.model('1', 'calculator-el')]
};
