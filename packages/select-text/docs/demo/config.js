const { model, mathSample, htmlSample, htmlAscii } = require('./generate');

module.exports = {
  elements: {
    'select-text': '../..'
  },
  models: [
    model('1', 'select-text')
  ]
};
