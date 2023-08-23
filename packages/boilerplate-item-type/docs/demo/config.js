const { model } = require('./generate');

module.exports = {
  elements: {
    'boilerplate-item-type': '../..',
  },
  models: [model('1', 'boilerplate-item-type')],
};
