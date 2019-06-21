exports.model = (id, element) => ({
  id,
  element,
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
  prompt: 'Set correct answer.',
  graph: {
    title: 'This is the title <span data-latex="">\\frac{1}{2}</span>',
    arrows: {
      left: true,
      right: true
    },
    width: 500,
    height: 400,
    domain: { min: -5, max: 5 },
    ticks: {
      minor: 1,
      major: 2
    },
    initialElements: [
      {
        type: 'point',
        pointType: 'full',
        domainPosition: -1
      }
    ],
    maxNumberOfPoints: 20,
    // tickFrequency: 6,
    showMinorTicks: true,
    snapPerTick: 1,
    tickLabelOverrides: [],
    initialType: 'PF',
    exhibitOnly: false,
    availableTypes: {
      PF: true,
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
});
