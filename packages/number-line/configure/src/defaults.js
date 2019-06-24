export const model = {
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
  height: 400,
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
  },
  initialElements: []
};

export const configuration = {
  prompt: {
    settings: true,
    label: 'Prompt'
  }
};
