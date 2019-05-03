const { model } = require('./generate');

module.exports = {
  elements: {
    'hotspot-element': '../..'
  },
  models: [model('1', 'hotspot-element')]
};
