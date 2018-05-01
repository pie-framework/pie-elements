// "feedba/ck":{"feedbackType":"default"},"model":{"config":{"expectedLength":100,"expectedLines":5,"showMathInput":false}},"minimumWidth":100}p

//feedback: { feedbackType: 'custom', feedback: 'custom value here' },

module.exports = {
  elements: {
    'extended-text-entry': '../..'
  },
  models: [
    {
      id: '1',
      element: 'extended-text-entry',
      feedback: { feedbackType: 'default' },
      model: {
        config: {
          expectedLength: 100,
          expectedLines: 5,
          showMathInput: false
        }
      },
      minimumWidth: 100
    }
  ]
};
