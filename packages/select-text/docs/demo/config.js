const { model, mathSample } = require('./generate');

module.exports = {
  elements: {
    'select-text': '../..'
  },
  models: [model('1', 'select-text'), mathSample('2', 'select-text')]
};
