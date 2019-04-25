const { model } = require('./generate');

module.exports = {
  elements: {
    'match-list': '../..'
  },
  models: [model('1', 'match-list')]
};
