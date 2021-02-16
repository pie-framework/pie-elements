export default {
  model: {
    visibleToStudent: true,
    halfScoring: false,
    pointLabels: true,
    description: false,
    standards: false,
    scales: [],
    excludeZero: false,
  },
  configuration: {
    showExcludeZero: {
      settings: true,
      label: 'Exclude Zero',
    },
    showScorePointLabels: {
      settings: true,
      label: 'Show Score Point Labels',
    },
    showDescription: {
      settings: true,
      label: 'Show Description',
    },
    showVisibleToStudent: {
      settings: true,
      label: 'Visible to Student',
    },
    showHalfScoring: {
      settings: true,
      label: 'Half Scoring',
    },
    maxWidth: '1000px',
    // these should not be set to true (should not be used) for now
    showStandards: {
      settings: false,
      label: 'Show Standards',
    },
    showLevelTagInput: {
      settings: false,
      label: 'Show Level Tag Input',
      enabled: false
    },
    dragAndDrop: {
      settings: false,
      label: 'Enable Drag and Drop',
      enabled: false,
    }
  }
};
