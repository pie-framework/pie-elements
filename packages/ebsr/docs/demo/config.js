const { model } = require('./generate');

module.exports = {
  elements: {
    'ebsr-element': '../..'
  },
  models: [model('1', 'ebsr-element')/*, model('2', 'ebsr-element')*/]
};
