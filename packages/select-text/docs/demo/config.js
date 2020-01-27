const { model, mathSample, htmlSample, htmlAscii } = require('./generate');

module.exports = {
  elements: {
    'select-text': '../..'
  },
  models: [
    model('1', 'select-text'),
    mathSample('2', 'select-text'),
    htmlSample('3', 'select-text'),
    htmlAscii('4', 'select-text')
  ]
};
