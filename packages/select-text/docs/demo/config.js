const { model, mathSample, htmlSample, htmlSample2 } = require('./generate');

module.exports = {
  elements: {
    'select-text': '../..'
  },
  models: [model('1', 'select-text'), mathSample('2', 'select-text'), htmlSample('3', 'select-text'), htmlSample2('4', 'select-text')]
};
