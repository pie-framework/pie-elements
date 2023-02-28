export default {
  model: {
    points: ['', '', '', ''],
    sampleAnswers: [null, null, null, null],
    maxPoints: 4,
    excludeZero: false,
    excludeZeroEnabled: true,
    maxPointsEnabled: true,
  },
  configuration: {
    showExcludeZero: {
      settings: true,
      label: 'Ability to exclude zero',
    },
    showMaxPoint: {
      settings: true,
      label: 'Show max points dropdown',
    },
    settingsPanelDisabled: false,
    // width: '500px'
  },
};
