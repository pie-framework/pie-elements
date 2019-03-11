export default {
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
};
