const { model } = require('./generate');

module.exports = {
  elements: {
    'match-element': '../..'
  },
  models: [model('1', 'match-element')]
};
