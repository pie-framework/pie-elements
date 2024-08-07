export default {
  graph: {
    domain: [-5, 5],
    ticks: {
      major: 2,
      minor: 1,
    },
    width: 500,
    initialElements: [],
    maxNumberOfPoints: 20,
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
      REP: true,
    },
  },
  feedback: {
    correct: {
      default: 'Correct',
      type: 'none',
    },
    incorrect: {
      default: 'Incorrect',
      type: 'none',
    },
    partial: {
      default: 'Nearly',
      type: 'none',
    },
  },
};
