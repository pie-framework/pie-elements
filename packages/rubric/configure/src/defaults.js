export default {
  model: {
    points: ['', '', '', ''],
    sampleAnswers: [null, null, null, null],
    maxPoints: 3,
    excludeZero: true,
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
    mathMlOptions: {
      mmlOutput: false,
      mmlEditing: false,
    },
    maxMaxPoints: 9,
  },
};
