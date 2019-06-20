const { model } = require('./generate');

module.exports = {
  elements: {
    'graphing-element': '../..'
  },
  models: [model('1', 'graphing-element')]
};
