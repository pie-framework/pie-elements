export default {
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
  config: {
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
    initialType: 'PF',
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
};
