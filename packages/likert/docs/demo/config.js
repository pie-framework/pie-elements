const { model } = require('./generate');

module.exports = {
  elements: {
    'likert-element': '../..'
  },
  models: [model('1', 'likert-element')]
};
