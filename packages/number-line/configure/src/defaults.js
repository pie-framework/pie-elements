export default {
  model: {
    prompt: 'Question Prompt goes here.',
    correctResponse: [],
    graph: {
      domain: [-5, 5],
      initialElements: [],
      showMinorTicks: true,
      initialType: 'PF',
      exhibitOnly: false,
      availableTypes: {
        PF: true,
        PE: false,
        LFF: false,
        LEF: false,
        LFE: false,
        LEE: false,
        RFN: false,
        RFP: false,
        REN: false,
        REP: false
      }
    }
  },
  configuration: {
    prompt: {
      settings: true,
      label: 'Prompt'
    }
  }
};
