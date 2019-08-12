const { model } = require('./generate');

module.exports = {
  elements: {
    'charting-element': '../..'
  },
  models: [model('1', 'charting-element')]
};
