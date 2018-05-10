module.exports = {
  elements: {
    'number-line': '../..'
  },
  models: [
    {
      id: '1',
      element: 'number-line',
      correctResponse: [
        {
          type: 'point',
          pointType: 'full',
          domainPosition: 1
        },
        {
          type: 'line',
          leftPoint: 'full',
          rightPoint: 'empty',
          domainPosition: 1,
          size: 2
        }
      ],
      feedback: {
        correct: {
          type: 'default',
          default: 'Correct'
        },
        partial: {
          type: 'default',
          default: 'Nearly'
        },
        incorrect: {
          type: 'custom',
          custom: '<h1>Incorrect</h1>'
        }
      },
      allowPartialScoring: true,
      partialScoring: [
        {
          numberOfCorrect: 1,
          scorePercentage: 35
        }
      ],
      config: {
        width: 500,
        height: 400,
        domain: [-5, 5],
        initialElements: [
          {
            type: 'point',
            pointType: 'empty',
            domainPosition: -1
          }
        ],
        maxNumberOfPoints: 20,
        tickFrequency: 6,
        showMinorTicks: true,
        snapPerTick: 1,
        tickLabelOverrides: [],
        initialType: 'PF',
        exhibitOnly: false,
        availableTypes: {
          PF: true,
          PE: true,
          LFF: true,
          LEF: true,
          LFE: true,
          LEE: true,
          RFN: true,
          RFP: true,
          REN: true,
          REP: true
        }
      }
    }
  ]
};
