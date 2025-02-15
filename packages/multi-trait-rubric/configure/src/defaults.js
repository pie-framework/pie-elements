export default {
  model: {
    addScaleEnabled: true,
    description: false,
    excludeZero: false,
    halfScoring: false,
    maxPointsEnabled: true,
    pointLabels: true,
    scales: [],
    standards: false,
    visibleToStudent: true,
  },
  configuration: {
    baseInputConfiguration: {
      audio: { disabled: false },
      video: { disabled: false },
      image: { disabled: false },
      textAlign: { disabled: true },
    },
    expandedInput: {
      inputConfiguration: {
        math: { disabled: true },
        audio: { disabled: false },
        video: { disabled: false },
        image: { disabled: false },
      },
    },
    labelInput: {
      inputConfiguration: {
        math: { disabled: true },
        audio: { disabled: true },
        video: { disabled: true },
        image: { disabled: true },
      },
    },
    excludeZeroDialogBoxContent: {
      title: 'Exclude 0 (Zero) from Score Point Values.',
      text: `<div>
        You are about to exclude 0 from score point values.
        <br/>
        Some of the existing data has to be changed.
        <br/>
        Please choose if you want to:
        <ul>
          <li>
            shift Labels and Descriptions to the left
          </li>
          <li>
            remove 0 column with its Label and Description
          </li>
        </ul>
      </div>`,
    },
    includeZeroDialogBoxContent: {
      title: 'Include 0 (Zero) in Score Point Values.',
      text: `<div>
        You are about to include 0 in score point values.
        <br/>
        Some of the existing data has to be changed.
        <br/>
        Please choose if you want to:
        <ul>
          <li>
            shift Labels and Descriptions to the right
          </li>
          <li>
            add 0 column with empty Label and Descriptions
          </li>
        </ul>
      </div>`,
    },
    deleteScaleDialogBoxContent: {
      title: 'Delete Scale',
      text: 'Are you sure you want to delete this scale?',
    },
    maxPointsDialogBoxContent: {
      title: 'Decreasing Max Points.',
      text: ` You are about to decrease max score point value.
        <br/>
        All the Labels and Descriptions for scores above Max Point will be deleted.`,
    },
    settingsPanelDisabled: false,
    spellCheck: {
      label: 'Spellcheck',
      settings: false,
      enabled: true,
    },
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
    // commenting this in order to use the dynamic width if the width was not set by the client (PD-3203)
    // width: '900px',
    // these should not be set to true (should not be used) for now
    showStandards: {
      settings: false,
      label: 'Show Standards',
    },
    showLevelTagInput: {
      settings: false,
      label: 'Show Level Tag Input',
      enabled: false,
    },
    dragAndDrop: {
      settings: true,
      label: 'Enable Drag and Drop',
      enabled: false,
    },
    showMaxPoint: {
      settings: true,
      label: 'Show Max Points Dropdown',
    },
    addScale: {
      settings: true,
      label: 'Add Scale Available',
    },
    minNoOfTraits: 1,
    maxNoOfTraits: 10,
    minNoOfScales: 1,
    maxNoOfScales: 10,
    defaultTraitLabel: 'Trait',
    mathMlOptions: {
      mmlOutput: false,
      mmlEditing: false,
    },
    maxMaxPoints: 10,
  },
};
