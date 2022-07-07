export default {
  // !! configure src defaults models needs to have the same content as controller src defaults
  correctResponse: [],
  graph: {
    domain: { min: -5, max: 5 },
    ticks: {
      minor: 1,
      major: 2
    },
    arrows: {
      left: true,
      right: true
    },
    maxNumberOfPoints: 20,
    width: 500,
    initialType: 'PF',
    exhibitOnly: false,
    toolbarEditorPosition: 'bottom',
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
    },
    initialElements: []
  },
  feedback: {
    correct: {
      default: 'Correct',
      type: 'none'
    },
    incorrect: {
      default: 'Incorrect',
      type: 'none'
    },
    partial: {
      default: 'Nearly',
      type: 'none'
    }
  },
};
