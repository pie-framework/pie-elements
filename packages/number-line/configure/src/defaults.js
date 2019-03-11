export default {
  correctResponse: [],
  allowPartialScoring: false,
  config: {
    domain: [-5, 5],
    initialElements: [
      {
        type: 'point',
        pointType: 'empty',
        domainPosition: -1
      }
    ],
    showMinorTicks: true,
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
};
