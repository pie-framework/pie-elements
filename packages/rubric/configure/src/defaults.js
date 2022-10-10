export default {
  model: {
    points: ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'],
    sampleAnswers: [null, 'just right', 'not left', null],
    maxPoints: 4,
    excludeZero: false,
    excludeZeroEnabled: true,
    maxPointsEnabled: true
  },
  configuration: {
    showExcludeZero: {
      settings: true,
      label: 'Ability to exclude zero',
    },
    showMaxPoint: {
      settings: true,
      label: 'Show max points dropdown'
    },
    settingsPanelDisabled: false
  }
};
