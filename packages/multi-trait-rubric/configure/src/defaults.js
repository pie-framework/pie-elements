export default {
  model: {
    visibleToStudent: true,
    halfScoring: false,
    pointLabels: true,
    description: false,
    standards: false,
    scales: []
  },
  configuration: {
    showStandards: {
      settings: true,
      label: 'Show Standards',
      enabled: false
    },
    showExcludeZero: {
      settings: true,
      label: 'Exclude Zero',
      enabled: false
    },
    showScorePointLabels: {
      settings: true,
      label: 'Show Score Point Labels',
      enabled: false
    },
    showLevelTagInput: {
      settings: true,
      label: 'Show Level Tag Input',
      enabled: false
    },
    showDescription: {
      settings: true,
      label: 'Show Description',
      enabled: false
    },
    showVisibleToStudent: {
      settings: true,
      label: 'Visible to Student',
      enabled: false
    },
    showHalfScoring: {
      settings: true,
      label: 'Half Scoring',
      enabled: false
    },
    dragAndDrop: {
      settings: false,
      label: 'Enable Drag and Drop',
      enabled: false,
    }
  }
};
