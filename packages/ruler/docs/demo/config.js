module.exports = {
  elements: {
    'ruler-element': '../..'
  },
  models: [
    {
      id: '1',
      element: 'ruler-element',
      model: {
        config: {
          units: 'metric',
          label: 'm',
          length: 20,
          pixelsPerUnit: 30,
          ticks: 10
        }
      }
    }
  ]
};
